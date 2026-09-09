"use client";

import { useEffect, useRef, type RefObject } from "react";
import { REDUCED_MOTION_QUERY } from "@/features/reader/lib/motionMode";

/** After the reader scrolls by hand, leave the page alone for this long. */
export const MANUAL_SCROLL_GRACE_MS = 3000;

/**
 * Keeps the current sentence centred on screen as playback moves, unless the reader has scrolled
 * manually in the last few seconds. Only user gestures (wheel, touch, keys) count as manual —
 * our own `scrollIntoView` fires scroll events too, so plain `scroll` is not what we listen to.
 * Returns a ref to hand to the sentence container; sentences are found by `data-index`.
 */
export function useFollowSentence(current: number, container: RefObject<HTMLElement | null>): void {
  const lastManual = useRef(0);

  useEffect(() => {
    const mark = () => {
      lastManual.current = Date.now();
    };
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("wheel", mark, opts);
    window.addEventListener("touchmove", mark, opts);
    window.addEventListener("keydown", mark, opts);
    return () => {
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchmove", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  useEffect(() => {
    if (current < 0) return;
    if (Date.now() - lastManual.current < MANUAL_SCROLL_GRACE_MS) return;
    const el = container.current?.querySelector<HTMLElement>(`[data-index="${current}"]`);
    if (!el) return;
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
  }, [current, container]);
}
