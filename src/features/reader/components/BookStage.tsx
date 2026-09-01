"use client";

import { forwardRef, useImperativeHandle, useRef, type PointerEvent } from "react";
import type { Book } from "@/lib/types";
import type { FlipDirection, PageLayout, ReaderSettings } from "../types";
import { dragProgress, pagesInView } from "../lib/flipMath";
import { useFlipController } from "../lib/useFlipController";
import { wordAtPoint } from "../lib/wordAtPoint";
import { PageLeaf } from "./PageLeaf";
import { PageView } from "./PageView";

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
}

const DRAG_THRESHOLD = 10;

/**
 * The book itself: static pages under a turning leaf, driven by drag, tap zones, or `turn()`.
 * Tap on Kannada text opens a lookup; tap in the outer thirds turns; tap in the middle toggles chrome.
 */
export const BookStage = forwardRef<BookStageHandle, BookStageProps>(function BookStage(
  { book, layout, settings, view, onViewChange, onWordTap, onCenterTap },
  ref
) {
  const ctl = useFlipController({ layout, view, onViewChange });
  const pointer = useRef<{ x: number; y: number; t: number; dragging: boolean; lastX: number; lastT: number } | null>(null);

  useImperativeHandle(ref, () => ({ turn: ctl.turn }), [ctl.turn]);

  const stageWidth = layout.mode === "spread" ? layout.pageWidth * 2 : layout.pageWidth;
  const [staticL, staticR] = ctl.flip ? ctl.flip.plan.under : pagesInView(view, layout.pageCount, layout.mode);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointer.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, dragging: false, lastX: e.clientX, lastT: e.timeStamp };
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
    if (!p) return;
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
      style={{ width: stageWidth, height: layout.pageHeight, perspective: 3200, perspectiveOrigin: "50% 50%" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="absolute inset-0 flex rounded-md overflow-hidden" style={{ boxShadow: "var(--sg-shadow-elevated)" }}>
        <PageView book={book} layout={layout} settings={settings} page={staticL} />
        {layout.mode === "spread" && <PageView book={book} layout={layout} settings={settings} page={staticR} />}
      </div>
      {layout.mode === "spread" && (
        <div aria-hidden="true" className="absolute top-0 bottom-0 w-px pointer-events-none" style={{ left: layout.pageWidth, background: "var(--sg-paper-edge)" }} />
      )}
      {ctl.flip && (
        <PageLeaf book={book} layout={layout} settings={settings} plan={ctl.flip.plan} leafRef={ctl.leafRef} shadeRef={ctl.shadeRef} />
      )}
    </div>
  );
});
