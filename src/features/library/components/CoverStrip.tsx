"use client";

import { Skeleton } from "@/components/ui/Card";
import { useBooksManifest } from "../lib/useBooksManifest";
import { StripCover } from "./StripCover";

const MOBILE = 4;
const DESKTOP = 6;

/** Four covers in a row on mobile; six as two rows of three beside the search on md+. Links into each book. */
export function CoverStrip() {
  const manifest = useBooksManifest();
  if (!manifest) {
    return (
      <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
        {Array.from({ length: DESKTOP }, (_, i) => (
          <Skeleton key={i} className={`h-24 md:h-[150px] ${i >= MOBILE ? "hidden md:block" : ""}`} />
        ))}
      </div>
    );
  }
  const books = manifest.books.slice(0, DESKTOP);
  if (books.length === 0) return null;
  return (
    <ul className="grid grid-cols-4 md:grid-cols-3 gap-2">
      {books.map((book, i) => (
        <li key={book.slug} className={i >= MOBILE ? "hidden md:block" : ""}>
          <StripCover book={book} index={i} />
        </li>
      ))}
    </ul>
  );
}
