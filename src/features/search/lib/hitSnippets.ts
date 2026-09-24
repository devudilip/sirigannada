import type { Book } from "@/lib/types";
import { normaliseBookSearchText, snippet } from "@/features/reader/lib/bookSearch";

export interface HitSnippet {
  block: number;
  chapterTitle: string;
  snippet: string;
}

/** Chapter title and a context snippet around the first query word for each hit block. */
export function hitSnippets(book: Pick<Book, "chapters">, blocks: readonly number[], terms: readonly string[]): HitSnippet[] {
  const located: { text: string; chapterTitle: string }[] = [];
  for (const chapter of book.chapters) {
    for (const text of chapter.blocks) located.push({ text, chapterTitle: chapter.title });
  }
  const first = terms[0] ?? "";
  return blocks.flatMap((block) => {
    const hit = located[block];
    if (!hit) return [];
    const matchAt = Math.max(0, normaliseBookSearchText(hit.text).indexOf(first));
    return [{ block, chapterTitle: hit.chapterTitle, snippet: snippet(hit.text, matchAt, first.length) }];
  });
}
