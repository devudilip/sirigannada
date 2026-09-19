"use client";

import type { Book } from "@/lib/types";
import { formatEra, toKannadaDigits } from "@/lib/kannada";
import { useT } from "@/components/providers/AppProviders";
import type { ReaderSettings } from "../types";
import { deckPageAt, type DeckIndex } from "../lib/verseDeck";
import { BASE_FONT_PX } from "./BookFlow";

interface VersePageProps {
  book: Book;
  deck: DeckIndex;
  settings: ReaderSettings;
  /** Deck page index. */
  page: number;
  width: number;
  height: number;
}

/**
 * One card of the verse deck: the book's title card, a chapter card, or a single verse.
 * Short verses sit centred on the page; a verse taller than the page scrolls inside its card
 * instead of being clipped. The verse keeps its `data-b` so tap-to-lookup, long-press actions
 * and the share card work exactly as they do in flow mode.
 */
export function VersePage({ book, deck, settings, page, width, height }: VersePageProps) {
  const t = useT();
  const at = deckPageAt(deck, page);
  if (!at) return null;
  const chapter = at.kind === "title" ? null : book.chapters[at.chapter];
  return (
    <div
      lang="kn"
      className={settings.font === "serif" ? "font-serif" : "font-sans"}
      style={{
        width,
        height,
        overflowY: "auto",
        overflowX: "hidden",
        touchAction: "pan-y",
        overscrollBehavior: "contain",
        fontSize: BASE_FONT_PX * settings.fontScale,
        lineHeight: `var(--sg-leading-reader-${settings.lineHeight})`,
        color: "var(--sg-text)",
      }}
    >
      <div className="flex min-h-full flex-col justify-center">
        {at.kind === "title" && (
          <header>
            <h1 className="font-bold text-[1.6em] leading-[1.5]">{book.title}</h1>
            <p className="mt-2 text-[0.95em]" style={{ color: "var(--sg-text-secondary)" }}>
              {book.author} · {formatEra(book.era, "kn")}
            </p>
            <p className="mt-4 text-[0.95em]" style={{ color: "var(--sg-text-secondary)" }}>
              {book.description}
            </p>
          </header>
        )}
        {at.kind === "chapter" && (
          <h2 className="text-center font-semibold text-[1.2em]" style={{ color: "var(--sg-accent)" }}>
            {chapter?.title}
          </h2>
        )}
        {at.kind === "verse" && (
          <>
            <p
              aria-hidden="true"
              className="mb-[1em] text-[0.72em] text-balance"
              style={{ color: "var(--sg-text-muted)" }}
            >
              {chapter?.title} · {t("verseNumber", { n: toKannadaDigits(at.verse) })}
            </p>
            <p data-b={at.block} className="whitespace-pre-line text-pretty">
              {chapter?.blocks[at.verse - 1]}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
