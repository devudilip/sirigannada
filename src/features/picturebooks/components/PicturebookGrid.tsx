"use client";

import { useApp } from "@/components/providers/AppProviders";
import { ReadToggle } from "@/components/ui/ReadToggle";
import type { PictureBookMeta } from "@/lib/types";
import { PicturebookCard } from "./PicturebookCard";

/** 2 columns on phones, 3–4 on md+. */
export function PicturebookGrid({ books, cacheTick = 0, finished }: { books: readonly PictureBookMeta[]; cacheTick?: number; finished?: (slug: string) => boolean }) {
  const { locale } = useApp();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <div key={book.slug} className="min-w-0 flex flex-col gap-3"><PicturebookCard book={book} cacheTick={cacheTick} />{finished && <ReadToggle id={`picturebook:${book.slug}`} finished={finished(book.slug)} title={locale === "en" && book.titleEn ? book.titleEn : book.title} />}</div>
      ))}
    </div>
  );
}
