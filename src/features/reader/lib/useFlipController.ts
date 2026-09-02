"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FlipDirection, PageLayout } from "../types";
import { angleAt, canTurn, planLeaf, shade, slideOffset, stageWidthOf, type LeafPlan } from "./flipMath";
import { REDUCED_MOTION_QUERY, type MotionMode } from "./motionMode";

export interface FlipState {
  plan: LeafPlan;
  direction: FlipDirection;
}

interface Options {
  layout: PageLayout;
  view: number;
  onViewChange: (view: number) => void;
  /** "flip" rotates a 3D leaf; "slide" translates a flat sheet. See `motionMode.ts`. */
  motion: MotionMode;
}

const DURATION_MS = 460;
const SLIDE_DURATION_MS = 260;
const EASING = "var(--sg-ease-out)";
const COMMIT_THRESHOLD = 0.3;
const FLING_VELOCITY = 0.6; // progress per 100ms

/**
 * Owns the life of one page turn: mount the leaf, drive its rotation from a drag (direct DOM
 * writes) or a CSS transition (release / tap / key), then commit or cancel.
 * All mutable state lives in refs so re-renders can never interrupt a turn in progress.
 */
export function useFlipController({ layout, view, onViewChange, motion }: Options) {
  const [flip, setFlip] = useState<FlipState | null>(null);
  const flipRef = useRef<FlipState | null>(null);
  const leafRef = useRef<HTMLDivElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const autoStartRef = useRef(false);
  const timerRef = useRef(0);
  const viewRef = useRef(view);
  const onViewChangeRef = useRef(onViewChange);
  const motionRef = useRef(motion);
  const stageWidthRef = useRef(stageWidthOf(layout));
  viewRef.current = view;
  onViewChangeRef.current = onViewChange;
  motionRef.current = motion;
  stageWidthRef.current = stageWidthOf(layout);

  const paint = useCallback((progress: number, transitionMs = 0) => {
    const f = flipRef.current;
    const leaf = leafRef.current;
    if (!f || !leaf) return;
    progressRef.current = progress;
    const t = transitionMs > 0 ? `${transitionMs}ms ${EASING}` : "none";
    leaf.style.transition = transitionMs > 0 ? `transform ${t}` : "none";
    leaf.style.transform =
      motionRef.current === "slide"
        ? `translate3d(${slideOffset(f.direction, progress, stageWidthRef.current)}px, 0, 0)`
        : `rotateY(${angleAt(f.plan, progress)}deg)`;
    if (shadeRef.current) {
      shadeRef.current.style.transition = transitionMs > 0 ? `opacity ${t}` : "none";
      shadeRef.current.style.opacity = String(shade(progress));
    }
  }, []);

  const finish = useCallback((committed: boolean) => {
    clearTimeout(timerRef.current);
    const f = flipRef.current;
    flipRef.current = null;
    progressRef.current = 0;
    if (committed && f) onViewChangeRef.current(f.direction === "forward" ? viewRef.current + 1 : viewRef.current - 1);
    setFlip(null);
  }, []);

  const animateTo = useCallback(
    (target: 0 | 1) => {
      clearTimeout(timerRef.current);
      const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const full = motionRef.current === "slide" ? SLIDE_DURATION_MS : DURATION_MS;
      const distance = Math.abs(target - progressRef.current);
      const duration = reduce ? 0 : Math.max(140, Math.round(full * distance));
      if (duration === 0) return finish(target === 1);
      paint(target, duration);
      const leaf = leafRef.current;
      const done = () => {
        leaf?.removeEventListener("transitionend", done);
        finish(target === 1);
      };
      leaf?.addEventListener("transitionend", done);
      timerRef.current = window.setTimeout(done, duration + 80); // safety net if transitionend never fires
    },
    [finish, paint]
  );

  /** Start a turn. Returns false if already turning or at the end of the book. */
  const begin = useCallback(
    (direction: FlipDirection, auto: boolean): boolean => {
      if (flipRef.current || !canTurn(viewRef.current, direction, layout.pageCount, layout.mode)) return false;
      const next = { plan: planLeaf(viewRef.current, direction, layout.pageCount, layout.mode), direction };
      flipRef.current = next;
      autoStartRef.current = auto;
      progressRef.current = 0;
      setFlip(next);
      return true;
    },
    [layout.pageCount, layout.mode]
  );

  // Leaf just mounted: paint the start pose, then run the whole turn if it was a tap/key.
  useEffect(() => {
    if (!flip) return;
    paint(0);
    if (autoStartRef.current) {
      autoStartRef.current = false;
      // Next frame so the start pose is committed before the transition begins.
      timerRef.current = window.setTimeout(() => animateTo(1), 16);
    }
  }, [flip, paint, animateTo]);

  const release = useCallback(
    (velocity: number) => {
      const p = progressRef.current;
      const commit = p > COMMIT_THRESHOLD || (velocity > FLING_VELOCITY && p > 0.05);
      animateTo(commit ? 1 : 0);
    },
    [animateTo]
  );

  const turn = useCallback((d: FlipDirection) => begin(d, true), [begin]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { flip, leafRef, shadeRef, begin, drag: paint, release, turn };
}
