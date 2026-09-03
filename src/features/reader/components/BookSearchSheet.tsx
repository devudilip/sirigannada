"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Book } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Sheet } from "@/components/ui/Sheet";
import { searchBook } from "../lib/bookSearch";

interface BookSearchSheetProps {
  open: boolean;
  book: Book;
  onClose: () => void;
  onSelect: (block: number) => void;
}

const RESULTS_PER_PAGE = 40;

export function BookSearchSheet({ open, book, onClose, onSelect }: BookSearchSheetProps) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(RESULTS_PER_PAGE);
  const deferredQuery = useDeferredValue(query);
  const matches = useMemo(() => searchBook(book, deferredQuery), [book, deferredQuery]);
  const visibleMatches = matches.slice(0, visibleCount);
  const groups = useMemo(() => {
    const grouped = new Map<number, typeof visibleMatches>();
    for (const result of visibleMatches) {
      const group = grouped.get(result.chapterIndex) ?? [];
      group.push(result);
      grouped.set(result.chapterIndex, group);
    }
    return [...grouped.values()];
  }, [visibleMatches]);
  const hasQuery = deferredQuery.trim().length > 0;
  const remainingToReveal = Math.min(RESULTS_PER_PAGE, matches.length - visibleCount);

  function updateQuery(value: string): void {
    setQuery(value);
    setVisibleCount(RESULTS_PER_PAGE);
  }

  return (
    <Sheet open={open} onClose={onClose} title={t("readerSearch")}>
      <SearchBox
        value={query}
        onChange={updateQuery}
        placeholder={t("readerSearchPlaceholder")}
        aria-label={t("readerSearchPlaceholder")}
        data-sheet-initial-focus=""
      />
      <p className="py-3 text-sm text-muted" aria-live="polite">
        {hasQuery ? t("readerSearchCount", { count: matches.length }) : t("readerSearchHint")}
      </p>
      {hasQuery && matches.length === 0 ? (
        <p className="py-8 text-center text-base text-secondary">{t("readerSearchNoResults")}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group[0]?.chapterIndex}>
              <h3 className="mb-1 px-2 font-serif text-base font-semibold text-accent" lang="kn">
                {group[0]?.chapterTitle}
              </h3>
              <ol className="flex flex-col divide-y divide-line">
                {group.map((result) => (
                  <li key={result.block}>
                    <button
                      type="button"
                      onClick={() => onSelect(result.block)}
                      className="min-h-11 w-full rounded-md px-2 py-3 text-left font-serif text-base leading-relaxed text-ink hover:bg-paper active:bg-paper-edge"
                      lang="kn"
                    >
                      {result.snippet}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
          {remainingToReveal > 0 && (
            <Button variant="secondary" onClick={() => setVisibleCount((count) => count + RESULTS_PER_PAGE)}>
              {t("readerSearchShowMore", { count: remainingToReveal })}
            </Button>
          )}
        </div>
      )}
    </Sheet>
  );
}
