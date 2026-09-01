"use client";

import type { Book } from "@/lib/types";
import type { PageLayout, ReaderSettings } from "../types";
import { textBox } from "../lib/usePageLayout";
import { BookFlow } from "./BookFlow";

interface PageViewProps {
  book: Book;
  layout: PageLayout;
  settings: ReaderSettings;
  /** Page index, or -1 for a blank sheet. */
  page: number;
}

/** One physical page: paper, padding, the text column for `page`, and a page number. */
export function PageView({ book, layout, settings, page }: PageViewProps) {
  const { width, height } = textBox(layout);
  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width: layout.pageWidth,
        height: layout.pageHeight,
        padding: layout.padding,
        background: "var(--sg-paper)",
      }}
    >
      {page >= 0 && (
        <>
          <div style={{ width, height, overflow: "hidden" }}>
            <BookFlow
              book={book}
              pageWidth={width}
              pageHeight={height}
              gap={layout.gap}
              fontScale={settings.fontScale}
              font={settings.font}
              page={page}
            />
          </div>
          <span
            className="absolute bottom-3 inset-x-0 text-center text-xs font-sans tabular-nums"
            style={{ color: "var(--sg-text-muted)" }}
          >
            {page + 1}
          </span>
        </>
      )}
    </div>
  );
}
