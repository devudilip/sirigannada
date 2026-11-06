"use client";

import { dailySelection } from "@/lib/dailySelection";
import { featuredBook } from "@/features/home/lib/featuredBook";
import { isRead } from "@/lib/readingStatus";
import { useReadingStatus } from "@/lib/useReadingStatus";

import { Skeleton } from "@/components/ui/Card";
import { readProgress } from "@/features/reader/lib/settings";
import { useBooksManifest } from "../lib/useBooksManifest";
import { StripCover } from "./StripCover";

/** Two columns on a phone, three on a tablet, six on a desktop; no hidden books. */
export function CoverStrip() {
  const states = useReadingStatus();
  const manifest = useBooksManifest();
  if (!manifest) return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}</div>;
  const featured = featuredBook(manifest.books, states, new Date(), readProgress);
  const books = dailySelection(manifest.books.filter((book) => !readProgress(book.slug) && !isRead(`book:${book.slug}`, states) && book.slug !== featured?.slug), (book) => book.slug, 6, new Date(), (book) => book.form);
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {books.map((book) => <li key={book.slug}><StripCover book={book} /></li>)}
    </ul>
  );
}
