"use client";

import { Skeleton } from "@/components/ui/Card";
import { useBooksManifest } from "../lib/useBooksManifest";
import { LibraryDiscovery } from "./LibraryDiscovery";

/** The full /library shelf: skeleton rows while the manifest loads, then search + rows. */
export function BookShelf() {
  const manifest = useBooksManifest();

  if (!manifest) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-13" />
        <Skeleton className="h-11" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-17" />
        ))}
      </div>
    );
  }

  if (manifest.books.length === 0) return null;
  return <LibraryDiscovery books={manifest.books} />;
}
