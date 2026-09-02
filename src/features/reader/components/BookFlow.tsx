"use client";

import { forwardRef, memo } from "react";
import type { Book } from "@/lib/types";
import { formatEra } from "@/lib/kannada";
import type { ReaderFont, ReaderLineHeight } from "../types";

interface BookFlowProps {
  book: Book;
  pageWidth: number;
  pageHeight: number;
  gap: number;
  fontScale: number;
  font: ReaderFont;
  lineHeight: ReaderLineHeight;
  /** Which page (column) to show. The flow is translated so that column sits at x=0. */
  page: number;
  /** Measuring flows are invisible and must not be translated. */
  measuring?: boolean;
}

export const BASE_FONT_PX = 17;

/**
 * The entire book laid out as CSS columns of exactly one page each.
 * Every block carries data-b (global block index) so we can map pages <-> blocks.
 */
export const BookFlow = memo(
  forwardRef<HTMLDivElement, BookFlowProps>(function BookFlow(
    { book, pageWidth, pageHeight, gap, fontScale, font, lineHeight, page, measuring = false },
    ref
  ) {
    const stride = pageWidth + gap;
    let blockIndex = 0;
    return (
      <div
        ref={ref}
        lang="kn"
        data-reader-flow=""
        aria-hidden={measuring || undefined}
        className={font === "serif" ? "font-serif" : "font-sans"}
        style={{
          width: pageWidth,
          height: pageHeight,
          columnWidth: pageWidth,
          columnGap: gap,
          columnFill: "auto",
          fontSize: BASE_FONT_PX * fontScale,
          lineHeight: `var(--sg-leading-reader-${lineHeight})`,
          color: "var(--sg-text)",
          transform: measuring ? undefined : `translateX(${-page * stride}px)`,
          visibility: measuring ? "hidden" : undefined,
          willChange: measuring ? undefined : "transform",
        }}
      >
        <header className="mb-8 break-inside-avoid">
          <h1 className="font-bold text-[1.6em] leading-tight">{book.title}</h1>
          <p className="mt-2 text-[0.95em]" style={{ color: "var(--sg-text-secondary)" }}>
            {book.author} · {formatEra(book.era, "kn")}
          </p>
          <p className="mt-4 text-[0.95em]" style={{ color: "var(--sg-text-secondary)" }}>
            {book.description}
          </p>
        </header>
        {book.chapters.map((ch, ci) => (
          <section key={ch.id} data-ch={ci} className="mb-6">
            <h2 className="font-semibold text-[1.2em] mt-2 mb-4 break-after-avoid" style={{ color: "var(--sg-accent)" }}>
              {ch.title}
            </h2>
            {ch.blocks.map((text) => {
              const b = blockIndex++;
              return (
                <p key={b} data-b={b} className="mb-[1.1em] whitespace-pre-line break-inside-avoid text-pretty">
                  {text}
                </p>
              );
            })}
          </section>
        ))}
        <footer className="mt-10 text-[0.8em] break-inside-avoid" style={{ color: "var(--sg-text-muted)" }}>
          {book.provenance.licenseNote}
        </footer>
      </div>
    );
  })
);
