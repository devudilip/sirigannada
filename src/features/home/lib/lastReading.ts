import type { BookMeta } from "@/lib/types";
import type { Progress } from "@/features/reader/types";

export interface LastReading {
  book: BookMeta;
  progress: Progress;
}

/** Most recently updated progress among the given books. Null if nothing saved. */
export function pickLastReading(
  books: BookMeta[],
  progressOf: (slug: string) => Progress | null,
): LastReading | null {
  let best: LastReading | null = null;
  for (const book of books) {
    const progress = progressOf(book.slug);
    if (!progress) continue;
    if (!best || progress.updatedAt > best.progress.updatedAt) best = { book, progress };
  }
  return best;
}
