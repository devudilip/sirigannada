"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookMeta } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { SearchBox } from "@/components/ui/SearchBox";
import { readProgress } from "@/features/reader/lib/settings";
import type { Progress } from "@/features/reader/types";
import { useCachedBooks } from "../lib/bookCache";
import { availableBookForms, filterBooks } from "../lib/filterBooks";
import { booksOnPath, startHerePaths, type StartHereId } from "../lib/startHere";
import type { BookFormFilter } from "../types";
import { BookRow } from "./BookRow";
import { FormChips } from "./FormChips";
import { StartHere } from "./StartHere";

/** Search, form chips, curated start-here cells, and the row list for /library. */
export function LibraryDiscovery({ books }: { books: BookMeta[] }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<BookFormFilter>("all");
  const [path, setPath] = useState<StartHereId | null>(null);
  const [progress, setProgress] = useState<Record<string, Progress | null>>({});

  const slugs = useMemo(() => books.map((b) => b.slug), [books]);
  const cached = useCachedBooks(slugs);
  const forms = useMemo(() => availableBookForms(books), [books]);
  const paths = useMemo(() => startHerePaths(books), [books]);
  const matches = useMemo(() => {
    const base = path === "old" ? booksOnPath(books, "old") : books;
    return filterBooks(base, query, form);
  }, [books, query, form, path]);

  // Progress lives in localStorage; read it after mount so server and client markup agree.
  useEffect(() => {
    setProgress(Object.fromEntries(slugs.map((slug) => [slug, readProgress(slug)])));
  }, [slugs]);

  const selectPath = (id: StartHereId) => {
    if (path === id) {
      setPath(null);
      setForm("all");
      return;
    }
    const chosen = paths.find((p) => p.id === id);
    setPath(id);
    setForm(chosen?.form ?? "all");
  };

  const selectForm = (next: BookFormFilter) => {
    setForm(next);
    setPath(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <SearchBox
        value={query}
        onChange={setQuery}
        size="lg"
        placeholder={t("librarySearchPlaceholder")}
        aria-label={t("librarySearchPlaceholder")}
      />
      <FormChips forms={forms} value={form} onChange={selectForm} />
      <p className="text-sm text-muted" aria-live="polite">
        {t("libraryVisibleCount", { shown: matches.length, total: books.length })}
      </p>
      <StartHere paths={paths} active={path} onSelect={selectPath} />
      {matches.length === 0 ? (
        <p className="rule-section py-8 text-base text-secondary">{t("libraryNoResults")}</p>
      ) : (
        <ul className="rule-section">
          {matches.map((book) => (
            <li key={book.slug}>
              <BookRow
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
