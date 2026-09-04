"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Book } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { useT } from "@/components/providers/AppProviders";
import { EntryCard } from "@/features/dictionary/components/EntryCard";
import type { SearchResult } from "@/features/dictionary/lib/search";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import { useProverbs } from "@/features/proverbs/lib/useProverbs";
import { searchBook } from "../lib/bookSearch";
import { matchProverbs } from "../lib/matchProverbs";

const MAX_OCCURRENCES_SHOWN = 8;

interface LookupSheetProps {
  word: string | null;
  result: SearchResult | null | undefined;
  book: Book;
  onClose: () => void;
  onJumpToOccurrence: (block: number) => void;
}

/**
 * Context lens for a word tapped in the reader (F-02): the dictionary hit (with its match
 * reason, so an inflected/phonetic guess reads as a guess, not a confirmed headword), where the
 * word occurs elsewhere in *this* book only (reuses B-04's `searchBook`, not a full-library
 * index — that's the separate, deferred roadmap item F-01), and any proverb containing it.
 * Save/cite reuse the existing collection and citation affordances rather than duplicating them.
 * `Sheet` already renders as a bottom sheet on mobile and a centred dialog on md+, covering the
 * "mobile sheet and wide-screen panel" requirement without a second primitive.
 */
export function LookupSheet({ word, result, book, onClose, onJumpToOccurrence }: LookupSheetProps) {
  const t = useT();
  const proverbs = useProverbs();
  const occurrences = useMemo(() => (word ? searchBook(book, word) : []), [book, word]);
  const proverbMatches = useMemo(() => (word && proverbs ? matchProverbs(proverbs, word) : []), [proverbs, word]);
  const shownOccurrences = occurrences.slice(0, MAX_OCCURRENCES_SHOWN);
  const hiddenOccurrences = occurrences.length - shownOccurrences.length;

  return (
    <Sheet open={word !== null} onClose={onClose} title={word ?? ""}>
      {word && (
        <div className="flex items-center justify-end -mt-1 mb-2">
          <SaveToCollectionButton item={{ kind: "word", word: result?.entry.word ?? word }} />
        </div>
      )}
      {result === undefined && <p className="text-secondary py-4">{t("loading")}</p>}
      {result === null && <p className="text-secondary py-4">{t("noResults")}</p>}
      {result && <EntryCard entry={result.entry} match={result.match} compact compactActions />}
      {word && (
        <Link href={`/dictionary?q=${encodeURIComponent(word)}`} className="inline-flex mt-3 text-sm font-medium text-accent hover:underline">
          {t("navDictionary")} →
        </Link>
      )}

      {word && (
        <section className="mt-5">
          <h3 className="text-sm font-medium text-ink">{t("contextLensInBook")}</h3>
          <p className="text-xs text-muted mt-0.5">{t("contextLensScopeNote")}</p>
          {occurrences.length === 0 ? (
            <p className="text-sm text-secondary py-2">{t("contextLensNoOccurrences")}</p>
          ) : (
            <>
              <p className="text-sm text-secondary mt-2" aria-live="polite">
                {t("readerSearchCount", { count: occurrences.length })}
              </p>
              <ol className="flex flex-col divide-y divide-line mt-1">
                {shownOccurrences.map((o) => (
                  <li key={o.block}>
                    <button
                      type="button"
                      onClick={() => onJumpToOccurrence(o.block)}
                      className="min-h-11 w-full rounded-md px-2 py-3 text-left font-serif text-base leading-relaxed text-ink hover:bg-paper active:bg-paper-edge"
                      lang="kn"
                    >
                      {o.snippet}
                    </button>
                  </li>
                ))}
              </ol>
              {hiddenOccurrences > 0 && (
                <p className="text-xs text-muted mt-1">{t("contextLensMoreOccurrences", { count: hiddenOccurrences })}</p>
              )}
            </>
          )}
        </section>
      )}

      {word && (
        <section className="mt-5">
          <h3 className="text-sm font-medium text-ink">{t("contextLensProverbs")}</h3>
          {proverbs === null ? (
            <p className="text-sm text-secondary py-2">{t("loading")}</p>
          ) : proverbMatches.length === 0 ? (
            <p className="text-sm text-secondary py-2">{t("contextLensNoProverbs")}</p>
          ) : (
            <ul className="flex flex-col gap-2 mt-2">
              {proverbMatches.map((p) => (
                <li key={p.id ?? p.text} className="font-serif text-base leading-relaxed text-ink" lang="kn">
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </Sheet>
  );
}
