"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type PointerEvent } from "react";
import type { Book } from "@/lib/types";
import type { FlipDirection, PageLayout, ReaderSettings } from "../types";
import { blockAtPoint } from "../lib/blockMap";
import { dragProgress, pagesAfterTurn, pagesInView, stageWidthOf } from "../lib/flipMath";
import { useFlipController } from "../lib/useFlipController";
import { useMotionMode } from "../lib/useMotionMode";
import { wordAtPoint } from "../lib/wordAtPoint";
import { PageLeaf } from "./PageLeaf";
import { PageView } from "./PageView";
import { SlideSheet } from "./SlideSheet";

export interface BookStageHandle {
  turn: (direction: FlipDirection) => boolean;
}

interface BookStageProps {
  book: Book;
  layout: PageLayout;
  settings: ReaderSettings;
  view: number;
  onViewChange: (view: number) => void;
  onWordTap: (word: string) => void;
  onCenterTap: () => void;
  /** Fired when a verse is pressed and held: used to copy its permalink. */
  onBlockLongPress: (block: number) => void;
}

const DRAG_THRESHOLD = 10;
const LONG_PRESS_MS = 500;
/** A finger that moves this far is scrolling/turning, not holding. */
const LONG_PRESS_SLOP = 8;

interface Pointer {
  x: number;
  y: number;
  t: number;
  dragging: boolean;
  held: boolean;
  lastX: number;
  lastT: number;
}

/**
 * The book itself: static pages under a turning leaf, driven by drag, tap zones, or `turn()`.
 * Tap on Kannada text opens a lookup; tap in the outer thirds turns; tap in the middle toggles chrome.
 * Press and hold a verse for {@link LONG_PRESS_MS} to copy its permalink instead.
 */
export const BookStage = forwardRef<BookStageHandle, BookStageProps>(function BookStage(
  { book, layout, settings, view, onViewChange, onWordTap, onCenterTap, onBlockLongPress },
  ref
) {
  const motion = useMotionMode();
  const ctl = useFlipController({ layout, view, onViewChange, motion });
  const pointer = useRef<Pointer | null>(null);
  const holdTimer = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({ turn: ctl.turn }), [ctl.turn]);

  const cancelHold = () => {
    if (holdTimer.current === null) return;
    window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  useEffect(() => cancelHold, []);

  const stageWidth = stageWidthOf(layout);
  // The 3D leaf uncovers a half-turned spread; the flat sheet slides over the view it replaces.
  const [staticL, staticR] =
    ctl.flip && motion === "flip" ? ctl.flip.plan.under : pagesInView(view, layout.pageCount, layout.mode);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointer.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, dragging: false, held: false, lastX: e.clientX, lastT: e.timeStamp };
    const { clientX, clientY } = e;
    cancelHold();
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      const p = pointer.current;
      if (!p || p.dragging) return;
      const block = blockAtPoint(clientX, clientY);
      if (block === null) return;
      p.held = true;
      navigator.vibrate?.(12);
      onBlockLongPress(block);
    }, LONG_PRESS_MS);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic or already-released pointer */
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > LONG_PRESS_SLOP || Math.abs(e.clientY - p.y) > LONG_PRESS_SLOP) cancelHold();
    if (!p.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) < Math.abs(e.clientY - p.y)) return;
      const direction: FlipDirection = dx < 0 ? "forward" : "backward";
      if (!ctl.begin(direction, false)) return;
      p.dragging = true;
    }
    if (ctl.flip) ctl.drag(dragProgress(dx, ctl.flip.direction, layout.pageWidth));
    p.lastX = e.clientX;
    p.lastT = e.timeStamp;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    pointer.current = null;
    cancelHold();
    if (!p) return;
    if (p.held) return; // the hold already copied a link; do not also look up or turn
    if (p.dragging) {
      const dt = Math.max(1, e.timeStamp - p.lastT);
      const velocity = (Math.abs(e.clientX - p.lastX) / layout.pageWidth) * (100 / dt);
      ctl.release(velocity);
      return;
    }
    if (ctl.flip) return;
    const word = wordAtPoint(e.clientX, e.clientY);
    if (word) return onWordTap(word);
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    if (fx < 0.3) ctl.turn("backward");
    else if (fx > 0.7) ctl.turn("forward");
    else onCenterTap();
  };

  return (
    <div
      role="presentation"
      className="relative touch-none"
      style={{
        width: stageWidth,
        height: layout.pageHeight,
        ...(motion === "flip" ? { perspective: 3200, perspectiveOrigin: "50% 50%" } : null),
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 flex rounded-md overflow-hidden" style={{ boxShadow: "var(--sg-shadow-elevated)" }}>
        <PageView book={book} layout={layout} settings={settings} page={staticL} />
        {layout.mode === "spread" && <PageView book={book} layout={layout} settings={settings} page={staticR} />}
      </div>
      {layout.mode === "spread" && (
        <div aria-hidden="true" className="absolute top-0 bottom-0 w-px pointer-events-none" style={{ left: layout.pageWidth, background: "var(--sg-paper-edge)" }} />
      )}
      {ctl.flip && motion === "flip" && (
        <PageLeaf book={book} layout={layout} settings={settings} plan={ctl.flip.plan} leafRef={ctl.leafRef} shadeRef={ctl.shadeRef} />
      )}
      {ctl.flip && motion === "slide" && (
        <SlideSheet
          book={book}
          layout={layout}
          settings={settings}
          pages={pagesAfterTurn(view, ctl.flip.direction, layout.pageCount, layout.mode)}
          direction={ctl.flip.direction}
          sheetRef={ctl.leafRef}
        />
      )}
    </div>
  );
});
