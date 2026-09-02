"use client";

import type { RefObject } from "react";
import type { Book } from "@/lib/types";
import type { FlipDirection, PageLayout, ReaderSettings } from "../types";
import { slideOffset, stageWidthOf } from "../lib/flipMath";
import { PageView } from "./PageView";

interface SlideSheetProps {
  book: Book;
  layout: PageLayout;
  settings: ReaderSettings;
  /** Pages of the view being turned to: [left, right] (-1 = blank). */
  pages: [number, number];
  direction: FlipDirection;
  sheetRef: RefObject<HTMLDivElement | null>;
}

/**
 * The reduced-motion / low-end page turn: the destination view as one flat sheet that the
 * controller slides in over the current one. No perspective, no backface, no shade — a single
 * 2D translate, which is the cheapest turn a budget phone can draw.
 */
export function SlideSheet({ book, layout, settings, pages, direction, sheetRef }: SlideSheetProps) {
  const [left, right] = pages;
  return (
    <div className="absolute inset-0 rounded-md overflow-hidden">
      <div
        ref={sheetRef}
        className="absolute inset-0 flex"
        style={{
          transform: `translate3d(${slideOffset(direction, 0, stageWidthOf(layout))}px, 0, 0)`,
          boxShadow: "var(--sg-shadow-elevated)",
        }}
      >
        <PageView book={book} layout={layout} settings={settings} page={left} />
        {layout.mode === "spread" && (
          <>
            <PageView book={book} layout={layout} settings={settings} page={right} />
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-px pointer-events-none"
              style={{ left: layout.pageWidth, background: "var(--sg-paper-edge)" }}
            />
          </>
        )}
      </div>
    </div>
  );
}
