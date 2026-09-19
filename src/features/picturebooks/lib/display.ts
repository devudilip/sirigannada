import type { Locale, PictureBookMeta } from "@/lib/types";

/** Title in the UI locale: the English title when reading in English and one exists. */
export function bookTitle(book: PictureBookMeta, locale: Locale): string {
  return locale === "en" && book.titleEn ? book.titleEn : book.title;
}
