import type { Book } from "@/lib/types";
import type { BookSearchResult } from "../types";

const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
const MARK = /\p{Mark}/u;
const LATIN = /\p{Script=Latin}/u;
const SNIPPET_CONTEXT = 54;

/**
 * NFC-normalise Kannada while making Latin text case- and diacritic-insensitive.
 * Kannada vowel signs are retained: stripping every Unicode mark would corrupt the script.
 */
export function normaliseBookSearchText(text: string): string {
  const decomposed = text.normalize("NFD").replace(ZERO_WIDTH, "").toLocaleLowerCase();
  let output = "";
  let followsLatin = false;

  for (const character of decomposed) {
    if (LATIN.test(character)) {
      output += character;
      followsLatin = true;
    } else if (MARK.test(character)) {
      if (!followsLatin) output += character;
    } else {
      output += character;
      followsLatin = false;
    }
  }

  return output.normalize("NFC").replace(/\s+/g, " ").trim();
}

function snippet(text: string, matchAt: number, queryLength: number): string {
  const compact = text.replace(/\s+/g, " ").trim();
  const start = Math.max(0, matchAt - SNIPPET_CONTEXT);
  const end = Math.min(compact.length, matchAt + queryLength + SNIPPET_CONTEXT);
  return `${start > 0 ? "…" : ""}${compact.slice(start, end)}${end < compact.length ? "…" : ""}`;
}

/** Search only the already-loaded book. Global block indices plug into the reader's page map. */
export function searchBook(book: Pick<Book, "chapters">, rawQuery: string): BookSearchResult[] {
  const query = normaliseBookSearchText(rawQuery);
  if (!query) return [];

  const matches: BookSearchResult[] = [];
  let block = 0;
  book.chapters.forEach((chapter, chapterIndex) => {
    for (const text of chapter.blocks) {
      const searchable = normaliseBookSearchText(text);
      const matchAt = searchable.indexOf(query);
      if (matchAt >= 0) {
        matches.push({
          block,
          chapterIndex,
          chapterTitle: chapter.title,
          snippet: snippet(text, matchAt, query.length),
        });
      }
      block += 1;
    }
  });
  return matches;
}
