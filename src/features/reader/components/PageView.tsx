"use client";

import { useMemo } from "react";
import type { Book } from "@/lib/types";
import type { PageLayout, ReaderSettings } from "../types";
import { textBox } from "../lib/usePageLayout";
import { deckIndex, effectiveVerseLayout } from "../lib/verseDeck";
import { BookFlow } from "./BookFlow";
import { VersePage } from "./VersePage";

interface PageViewProps {
  book: Book;
  layout: PageLayout;
  settings: ReaderSettings;
  /** Page index, or -1 for a blank sheet. */
  page: number;
}

/** One physical page: paper, padding, the content for `page`, and a page number. */
export function PageView({ book, layout, settings, page }: PageViewProps) {
  const { width, height } = textBox(layout);
  const deckMode = effectiveVerseLayout(settings.verseLayout, book.form) === "one-per-page";
  const deck = useMemo(() => deckIndex(book), [book]);
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
          {deckMode ? (
            <VersePage book={book} deck={deck} settings={settings} page={page} width={width} height={height} />
          ) : (
            <div style={{ width, height, overflow: "hidden" }}>
              <BookFlow
                book={book}
                pageWidth={width}
                pageHeight={height}
                gap={layout.gap}
                fontScale={settings.fontScale}
                font={settings.font}
                lineHeight={settings.lineHeight}
                page={page}
              />
            </div>
          )}
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
