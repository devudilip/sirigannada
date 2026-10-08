"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookMeta } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { SearchBox } from "@/components/ui/SearchBox";
import { readProgress } from "@/features/reader/lib/settings";
import type { Progress } from "@/features/reader/types";
import { useCachedBooks } from "../lib/bookCache";
import { availableBookForms, filterBooks } from "../lib/filterBooks";
import type { BookFormFilter } from "../types";
import { BookTile, SectionTile, type ShelfTile } from "./BookTile";
import { FormChips } from "./FormChips";

/**
 * /library: the search box, the form chips, then every book as a box in a grid. `extra` is a
 * non-book box (ಚಿತ್ರಕಥೆ) with a chip of its own; it is shown first under ಎಲ್ಲ, alone under its
 * chip, and only while the search matches its title.
 */
export function LibraryDiscovery({ books, extra }: { books: BookMeta[]; extra?: ShelfTile }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<BookFormFilter>("all");
  const [progress, setProgress] = useState<Record<string, Progress | null>>({});

  const slugs = useMemo(() => books.map((b) => b.slug), [books]);
  const cached = useCachedBooks(slugs);
  const forms = useMemo(() => availableBookForms(books), [books]);
  const matches = useMemo(() => (form === "chitrakathe" ? [] : filterBooks(books, query, form)), [books, query, form]);
  const showExtra = !!extra && (form === "all" || form === "chitrakathe") && (query.trim() === "" || extra.title.includes(query.trim()));

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
      <FormChips forms={forms} extra={extra?.title} value={form} onChange={setForm} />
      {form !== "chitrakathe" && (
        <p className="text-sm text-muted" aria-live="polite">
          {t("libraryVisibleCount", { shown: matches.length, total: books.length })}
        </p>
      )}
      {matches.length === 0 && !showExtra ? (
        <p className="rule-section py-8 text-base text-secondary">{t("libraryNoResults")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {showExtra && extra && <li><SectionTile tile={extra} /></li>}
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
