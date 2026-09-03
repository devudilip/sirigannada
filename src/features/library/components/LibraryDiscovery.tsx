"use client";

import { useMemo, useState } from "react";
import type { BookForm, BookMeta } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { SearchBox } from "@/components/ui/SearchBox";
import { availableBookForms, filterBooks } from "../lib/filterBooks";
import type { BookFormFilter } from "../types";
import { BookCard } from "./BookCard";

const FORM_KEYS = {
  vachana: "formVachana",
  tripadi: "formTripadi",
  shatpadi: "formShatpadi",
  kirtane: "formKirtane",
  prose: "formProse",
  poem: "formPoem",
  mixed: "formMixed",
} as const;

export function LibraryDiscovery({ books }: { books: BookMeta[] }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<BookFormFilter>("all");
  const forms = useMemo(() => availableBookForms(books), [books]);
  const matches = useMemo(() => filterBooks(books, query, form), [books, query, form]);

  return (
    <div className="flex flex-col gap-5">
      <SearchBox
        value={query}
        onChange={setQuery}
        size="lg"
        placeholder={t("librarySearchPlaceholder")}
        aria-label={t("librarySearchPlaceholder")}
      />
      <label className="flex flex-col gap-2 text-base text-secondary sm:max-w-xs">
        <span>{t("libraryFilterLabel")}</span>
        <select
          value={form}
          onChange={(event) => setForm(event.target.value as BookFormFilter)}
          className="h-12 rounded-md border border-line bg-elevated px-3 text-ink outline-none focus:border-accent"
        >
          <option value="all">{t("libraryAllForms")}</option>
          {forms.map((item: BookForm) => (
            <option key={item} value={item}>{t(FORM_KEYS[item])}</option>
          ))}
        </select>
      </label>
      <p className="text-sm text-muted" aria-live="polite">
        {t("libraryVisibleCount", { shown: matches.length, total: books.length })}
      </p>
      {matches.length === 0 ? (
        <p className="py-8 text-center text-base text-secondary">{t("libraryNoResults")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {matches.map((book) => (
            <li key={book.slug}><BookCard book={book} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
