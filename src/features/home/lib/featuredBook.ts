import type { BookMeta } from "@/lib/types";
import type { Progress } from "@/features/reader/types";
import { isRead, type ReadingStates } from "@/lib/readingStatus";

/** A stable daily discovery: never repeat a started or finished book. */
export function featuredBook(
  books: readonly BookMeta[],
  states: ReadingStates,
  date: Date,
  progressOf: (slug: string) => Progress | null = () => null,
): BookMeta | undefined {
  const pool = books.filter((book) => book.cover && !progressOf(book.slug) && !isRead(`book:${book.slug}`, states));
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return pool.length ? pool[day % pool.length] : undefined;
}
