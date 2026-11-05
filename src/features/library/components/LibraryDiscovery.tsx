"use client";

import { DiscoveryFilters } from "@/components/ui/DiscoveryFilters";

import { useDiscoveryState } from "@/lib/useDiscoveryState";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import type { BookMeta } from "@/lib/types";
import { useApp } from "@/components/providers/AppProviders";
import { ReadingFilters } from "@/components/ui/ReadingFilters";
import { ReadToggle } from "@/components/ui/ReadToggle";
import { isRead, matchesReadingFilter, type ReadingFilter } from "@/lib/readingStatus";
import { useReadingStatus } from "@/lib/useReadingStatus";
import { SearchBox } from "@/components/ui/SearchBox";
import { readProgress } from "@/features/reader/lib/settings";
import type { Progress } from "@/features/reader/types";
import { useCachedBooks } from "../lib/bookCache";
import { availableBookForms, filterBooks } from "../lib/filterBooks";
import { isSectionFilter, type BookFormFilter } from "../types";
import { BookTile, SectionTile, type ShelfTile } from "./BookTile";
import { FormChips } from "./FormChips";

/**
 * /library: the search box, a link to search inside every book, the form chips, then every
 * book as a box in a grid. `extras` are the non-book boxes (ಚಿತ್ರಕಥೆ, ಕರ್ನಾಟಕ ಇತಿಹಾಸ), each with a
 * chip of its own; they are shown first under ಎಲ್ಲ, alone under their chip, and only while the
 * search matches their title.
 */
export function LibraryDiscovery({ books, extras = [] }: { books: BookMeta[]; extras?: ShelfTile[] }) {
  const { t, locale } = useApp();
  const states = useReadingStatus();
  const [{ visibleCount, reading, query, form }, update] = useDiscoveryState({ visibleCount: 24, reading: "unread" as ReadingFilter, query: "", form: "all" as BookFormFilter });
  const setQuery = (query: string) => update({ query, visibleCount: 24 });
  const setReading = (reading: ReadingFilter) => update({ reading, visibleCount: 24 });
  const setForm = (form: BookFormFilter) => update({ form, visibleCount: 24 });
  const finished = (book: BookMeta) => isRead(`book:${book.slug}`, states, (progress[book.slug]?.block ?? -1) >= book.blockCount - 1);
  const [progress, setProgress] = useState<Record<string, Progress | null>>({});

  const slugs = useMemo(() => books.map((b) => b.slug), [books]);
  const cached = useCachedBooks(slugs);
  const forms = useMemo(() => availableBookForms(books), [books]);
  const sectionOnly = isSectionFilter(form);
  const matches = sectionOnly ? [] : filterBooks(books, query, form).filter((book) => matchesReadingFilter(finished(book), reading));
  const shownExtras = extras.filter((tile) => reading !== "read" && (form === "all" || form === tile.id) && (query.trim() === "" || tile.title.includes(query.trim())));

  // Progress lives in localStorage; read it after mount so server and client markup agree.
  useEffect(() => {
    setProgress(Object.fromEntries(slugs.map((slug) => [slug, readProgress(slug)])));
  }, [slugs]);

  return (
    <div className="flex flex-col gap-5">
      <SearchBox
        value={query}
        onChange={setQuery}
        size="lg"
        placeholder={t("librarySearchPlaceholder")}
        aria-label={t("librarySearchPlaceholder")}
      />
      <Link href="/search" className="-mt-2 inline-flex min-h-11 items-center gap-2 self-start font-semibold text-accent hover:underline">
        {t("corpusSearchLibraryLink")}
        <ArrowRightIcon size={18} />
      </Link>
      <ReadingFilters value={reading} onChange={setReading} />
      <DiscoveryFilters active={form !== "all"} onReset={() => update({ form: "all", reading: "unread", query: "", visibleCount: 24 })}><FormChips forms={forms} extras={extras.map((tile) => ({ id: tile.id, label: tile.title }))} value={form} onChange={setForm} /></DiscoveryFilters>
      {!sectionOnly && (
        <p className="text-sm text-muted" aria-live="polite">
          {t("libraryVisibleCount", { shown: Math.min(visibleCount, matches.length), total: books.length })}
        </p>
      )}
      {matches.length === 0 && shownExtras.length === 0 ? (
        <p className="rule-section py-8 text-base text-secondary">{t(reading === "all" ? "libraryNoResults" : "readingEmpty")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {shownExtras.map((tile) => <li key={tile.id}><SectionTile tile={tile} /></li>)}
          {matches.slice(0, visibleCount).map((book) => (
            <li key={book.slug} className="flex flex-col gap-2">
              <BookTile
                book={book}
                progress={progress[book.slug] ?? null}
                cached={cached === null ? null : cached.has(book.slug)}
              />
              <ReadToggle id={`book:${book.slug}`} finished={finished(book)} title={locale === "en" && book.titleEn ? book.titleEn : book.title} />
            </li>
          ))}
        </ul>
      )}
      {visibleCount < matches.length && <button type="button" onClick={() => update({ visibleCount: visibleCount + 24 })} className="min-h-11 rounded-md border border-line p-3 font-semibold text-accent-strong">{t("readingShowMore")}</button>}
    </div>
  );
}
