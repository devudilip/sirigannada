import type { BookMeta, BookForm } from "@/lib/types";
import type { BookFormFilter } from "../types";

const FORM_ORDER: readonly BookForm[] = [
  "vachana",
  "tripadi",
  "shatpadi",
  "kirtane",
  "prose",
  "poem",
  "mixed",
];

function normalize(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase();
}

export function availableBookForms(books: readonly BookMeta[]): BookForm[] {
  const available = new Set(books.map((book) => book.form));
  return FORM_ORDER.filter((form) => available.has(form));
}

export function filterBooks(
  books: readonly BookMeta[],
  query: string,
  form: BookFormFilter,
): BookMeta[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);

  return books.filter((book) => {
    if (form !== "all" && book.form !== form) return false;
    if (terms.length === 0) return true;

    const searchable = normalize(
      [book.title, book.titleEn, book.author, book.authorEn].filter(Boolean).join(" "),
    );
    return terms.every((term) => searchable.includes(term));
  });
}
