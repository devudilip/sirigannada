import type { PictureBookMeta } from "@/lib/types";
import { PicturebookCard } from "./PicturebookCard";

/** 2 columns on phones, 3–4 on md+. */
export function PicturebookGrid({ books, cacheTick = 0 }: { books: readonly PictureBookMeta[]; cacheTick?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <PicturebookCard key={book.slug} book={book} cacheTick={cacheTick} />
      ))}
    </div>
  );
}
