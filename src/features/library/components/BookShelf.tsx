"use client";

import { Skeleton } from "@/components/ui/Card";
import { useBooksManifest } from "../lib/useBooksManifest";
import { BookCard } from "./BookCard";
import { LibraryDiscovery } from "./LibraryDiscovery";

export function BookShelf({ limit }: { limit?: number }) {
  const manifest = useBooksManifest();

  if (!manifest) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: limit ?? 6 }, (_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    );
  }

  const books = limit ? manifest.books.slice(0, limit) : manifest.books;
  if (books.length === 0) return null;

  if (!limit) return <LibraryDiscovery books={books} />;

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {books.map((b) => (
        <li key={b.slug}>
          <BookCard book={b} />
        </li>
      ))}
    </ul>
  );
}
