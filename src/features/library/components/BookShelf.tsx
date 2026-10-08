"use client";

import { Skeleton } from "@/components/ui/Card";
import { useBooksManifest } from "../lib/useBooksManifest";
import type { ShelfTile } from "./BookTile";
import { LibraryDiscovery } from "./LibraryDiscovery";

/** The full /library shelf: skeleton boxes while the manifest loads, then search, chips and the box grid. */
export function BookShelf({ extra }: { extra?: ShelfTile }) {
  const manifest = useBooksManifest();

  if (!manifest) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-13" />
        <Skeleton className="h-11" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="aspect-[3/5]" />
          ))}
        </div>
      </div>
    );
  }

  if (manifest.books.length === 0) return null;
  return <LibraryDiscovery books={manifest.books} extra={extra} />;
}
