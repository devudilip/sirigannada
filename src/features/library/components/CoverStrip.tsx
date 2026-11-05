"use client";

import { Skeleton } from "@/components/ui/Card";
import { useBooksManifest } from "../lib/useBooksManifest";
import { StripCover } from "./StripCover";

/** Two columns on a phone, three on a tablet, six on a desktop; no hidden books. */
export function CoverStrip() {
  const manifest = useBooksManifest();
  if (!manifest) return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}</div>;
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {manifest.books.slice(0, 6).map((book) => <li key={book.slug}><StripCover book={book} /></li>)}
    </ul>
  );
}
