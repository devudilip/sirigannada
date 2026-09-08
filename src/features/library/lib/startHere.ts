import type { StringKey } from "@/lib/i18n";
import { kannadaToArabicDigits } from "@/features/tools/lib/numerals";
import type { BookForm, BookMeta } from "@/lib/types";

/** Curated entry points on /library. `vachana`/`prose` map to a form; `old` is an era rule. */
export type StartHereId = "vachana" | "prose" | "old";

export interface StartHerePath {
  id: StartHereId;
  titleKey: StringKey;
  subKey: StringKey;
  /** Form filter this path corresponds to, when it is a plain form. */
  form?: BookForm;
  books: BookMeta[];
}

/** First century whose texts read as modern-ish Kannada; earlier ones are the "old Kannada" path. */
export const OLD_KANNADA_BEFORE_CENTURY = 16;

/**
 * Century for an era string as written in the books manifest: "12th century", "೧೨ನೇ ಶತಮಾನ",
 * "16ನೇ ಶತಮಾನ", or a plain year like "1924" (→ 20). Null for anything else.
 */
export function parseCentury(era: string): number | null {
  const text = kannadaToArabicDigits(era.normalize("NFKC").trim());
  const century = text.match(/^(\d{1,2})\s*(?:st|nd|rd|th)?\s*(?:century|ನೇ\s*ಶತಮಾನ)$/i)?.[1];
  if (century) return Number(century);
  if (/^\d{3,4}$/.test(text)) return Math.floor((Number(text) - 1) / 100) + 1;
  return null;
}

/** Pre-16th-century texts that are not vachanas (those have their own path). */
export function isOldKannada(book: Pick<BookMeta, "era" | "form">): boolean {
  if (book.form === "vachana") return false;
  const century = parseCentury(book.era);
  return century !== null && century < OLD_KANNADA_BEFORE_CENTURY;
}

/** Books on a given path, in manifest order. */
export function booksOnPath(books: readonly BookMeta[], id: StartHereId): BookMeta[] {
  switch (id) {
    case "vachana":
      return books.filter((b) => b.form === "vachana");
    case "prose":
      return books.filter((b) => b.form === "prose");
    case "old":
      return books.filter(isOldKannada);
  }
}

/** The three curated paths, dropping any that would be empty for this shelf. */
export function startHerePaths(books: readonly BookMeta[]): StartHerePath[] {
  const all: StartHerePath[] = [
    { id: "vachana", titleKey: "libraryPathVachana", subKey: "libraryPathVachanaSub", form: "vachana", books: booksOnPath(books, "vachana") },
    { id: "prose", titleKey: "libraryPathProse", subKey: "libraryPathProseSub", form: "prose", books: booksOnPath(books, "prose") },
    { id: "old", titleKey: "libraryPathOld", subKey: "libraryPathOldSub", books: booksOnPath(books, "old") },
  ];
  return all.filter((path) => path.books.length > 0);
}
