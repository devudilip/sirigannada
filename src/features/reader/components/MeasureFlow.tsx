"use client";

import type { RefObject } from "react";
import type { Book } from "@/lib/types";
import type { PageLayout, ReaderSettings } from "../types";
import { textBox } from "../lib/usePageLayout";
import { BookFlow } from "./BookFlow";

interface MeasureFlowProps {
  book: Book;
  layout: PageLayout;
  settings: ReaderSettings;
  flowRef: RefObject<HTMLDivElement | null>;
}

/**
 * The invisible copy of the whole book used to derive page count and block↔page mapping in
 * flow mode. Laid out exactly like a visible page but never translated, so `offsetLeft` of a
 * `[data-b]` element gives the column (page) it landed in.
 */
export function MeasureFlow({ book, layout, settings, flowRef }: MeasureFlowProps) {
  const { width, height } = textBox(layout);
  return (
    <div className="absolute left-0 top-0 pointer-events-none" aria-hidden="true">
      <BookFlow
        ref={flowRef}
        book={book}
        pageWidth={width}
        pageHeight={height}
        gap={layout.gap}
        fontScale={settings.fontScale}
        font={settings.font}
        lineHeight={settings.lineHeight}
        page={0}
        measuring
      />
    </div>
  );
}
