import type { BookMeta } from "@/lib/types";
import { isRead, type ReadingStates } from "@/lib/readingStatus";

/** One stable daily recommendation. Finished books are excluded; if everything is read, offer a reread. */
export function featuredBook(books: readonly BookMeta[], states: ReadingStates, date: Date): BookMeta | undefined {
  const illustrated = books.filter((book) => book.cover);
  const unread = illustrated.filter((book) => !isRead(`book:${book.slug}`, states));
  const pool = unread.length ? unread : illustrated;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return pool.length ? pool[day % pool.length] : undefined;
}
