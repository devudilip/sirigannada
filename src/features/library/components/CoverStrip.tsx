"use client";

import { Skeleton } from "@/components/ui/Card";
import { useBooksManifest } from "../lib/useBooksManifest";
import { StripCover } from "./StripCover";

const MOBILE = 4;
const DESKTOP = 6;

/** Four covers in a row through 1032 px; six as two rows of three beside the search from 1033 px up. Links into each book. */
export function CoverStrip() {
  const manifest = useBooksManifest();
  if (!manifest) {
    return (
      <div className="grid grid-cols-3 min-[1033px]:grid-cols-3 gap-2">
        {Array.from({ length: DESKTOP }, (_, i) => (
          <Skeleton
            key={i}
            className={`h-24 min-[1033px]:h-[150px] ${i >= MOBILE ? "min-[1033px]:block" : ""}`}
          />
        ))}
      </div>
    );
  }
  const books = manifest.books.slice(0, DESKTOP);
  if (books.length === 0) return null;
  return (
    <ul className="grid grid-cols-3 min-[1033px]:grid-cols-3 gap-2">
      {books.map((book, i) => (
        <li key={book.slug} className={i >= MOBILE ? "min-[1033px]:block" : ""}>
          <StripCover book={book} index={i} />
        </li>
      ))}
    </ul>
  );
}
