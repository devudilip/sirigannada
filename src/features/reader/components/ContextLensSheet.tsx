"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Book } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
  const router = useRouter();
  const proverbs = useProverbs();
  const occurrences = useMemo(() => (word ? searchBook(book, word) : []), [book, word]);
  const proverbMatches = useMemo(() => (word && proverbs ? matchProverbs(proverbs, word) : []), [proverbs, word]);
  const shownOccurrences = occurrences.slice(0, MAX_OCCURRENCES_SHOWN);
  const hiddenOccurrences = occurrences.length - shownOccurrences.length;
  const guess = result && (result.match === "inflected" || result.match === "phonetic");
  const dictionaryHref = word ? `/dictionary?q=${encodeURIComponent(result?.entry.word ?? word)}` : "/dictionary";

  return (
    <Sheet open={word !== null} onClose={onClose} title={word ?? ""}>
      {result === undefined && <p className="text-secondary py-4">{t("loading")}</p>}
      {result === null && <p className="text-secondary py-4">{t("noResults")}</p>}
      {guess && word && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center bg-accent-soft text-accent-text text-xs font-semibold px-2 py-1">
            {t("lensBestGuess")}
            <span className="font-serif font-normal text-sm" lang="kn">
              {" · "}
              {result.entry.word}
              {result.suffix ? ` + ${result.suffix}` : ""}
            </span>
          </span>
          <Link href={dictionaryHref} className="inline-flex items-center border border-line text-muted text-xs px-2 py-1 hover:text-ink">
            {t("lensNotSure", { word: result.entry.word })}
          </Link>
        </div>
      )}
      {result && <EntryCard entry={result.entry} compact compactActions />}

      {word && (
        <section className="mt-4">
          <SectionHeading k="contextLensInBook" detail={String(occurrences.length)} />
          <p className="text-xs text-muted -mt-2 mb-2">{t("contextLensScopeNote")}</p>
          {occurrences.length === 0 ? (
            <p className="text-sm text-secondary py-2">{t("contextLensNoOccurrences")}</p>
          ) : (
            <>
              <ol className="flex flex-col">
                {shownOccurrences.map((o) => (
                  <li key={o.block} className="rule-row">
                    <button
                      type="button"
                      onClick={() => onJumpToOccurrence(o.block)}
                      className="min-h-11 w-full py-3 text-left font-serif text-base leading-relaxed text-ink hover:bg-elevated active:bg-paper-edge"
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
        <section className="mt-4">
          <SectionHeading k="contextLensProverbs" detail={String(proverbMatches.length)} />
          {proverbs === null ? (
            <p className="text-sm text-secondary py-2">{t("loading")}</p>
          ) : proverbMatches.length === 0 ? (
            <p className="text-sm text-secondary py-2">{t("contextLensNoProverbs")}</p>
          ) : (
            <ul className="flex flex-col">
              {proverbMatches.map((p) => (
                <li key={p.id ?? p.text} className="rule-row py-3 font-serif text-base leading-relaxed text-ink" lang="kn">
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {word && (
        <div className="mt-5 flex items-center gap-2">
          <Button variant="primary" onClick={() => router.push(dictionaryHref)}>
            {t("lensFullEntry")}
          </Button>
          <SaveToCollectionButton item={{ kind: "word", word: result?.entry.word ?? word }} />
        </div>
      )}
    </Sheet>
  );
}
