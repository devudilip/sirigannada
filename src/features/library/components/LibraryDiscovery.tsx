"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import type { BookMeta } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
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
  const t = useT();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<BookFormFilter>("all");
  const [progress, setProgress] = useState<Record<string, Progress | null>>({});

  const slugs = useMemo(() => books.map((b) => b.slug), [books]);
  const cached = useCachedBooks(slugs);
  const forms = useMemo(() => availableBookForms(books), [books]);
  const sectionOnly = isSectionFilter(form);
  const matches = useMemo(() => (sectionOnly ? [] : filterBooks(books, query, form)), [books, query, form, sectionOnly]);
  const shownExtras = extras.filter((tile) => (form === "all" || form === tile.id) && (query.trim() === "" || tile.title.includes(query.trim())));

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
      <FormChips forms={forms} extras={extras.map((tile) => ({ id: tile.id, label: tile.title }))} value={form} onChange={setForm} />
      {!sectionOnly && (
        <p className="text-sm text-muted" aria-live="polite">
          {t("libraryVisibleCount", { shown: matches.length, total: books.length })}
        </p>
      )}
      {matches.length === 0 && shownExtras.length === 0 ? (
        <p className="rule-section py-8 text-base text-secondary">{t("libraryNoResults")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {shownExtras.map((tile) => <li key={tile.id}><SectionTile tile={tile} /></li>)}
          {matches.map((book) => (
            <li key={book.slug}>
              <BookTile
                book={book}
                progress={progress[book.slug] ?? null}
                cached={cached === null ? null : cached.has(book.slug)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
