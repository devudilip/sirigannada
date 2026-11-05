"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import type { BookMeta } from "@/lib/types";
import { BookCover } from "./BookCover";
import { MiniCover } from "./MiniCover";

/** Neutral photography, with readable titles below rather than over the photograph. */
export function StripCover({ book }: { book: BookMeta }) {
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;
  return (
    <Link href={`/library/${book.slug}`} className="group block h-full rounded-lg border border-line bg-elevated overflow-hidden hover:border-accent-strong transition-colors">
      {book.cover ? <BookCover cover={book.cover} className="w-full aspect-[3/4] rounded-none" /> : <MiniCover title={book.title} form={book.form} className="w-full aspect-[3/4] rounded-none" />}
      <div className="p-3">
        <h3 className="font-serif text-base font-semibold break-words" lang={locale}>{title}</h3>
        <p className="mt-1 text-base text-secondary break-words" lang={locale}>{author}</p>
      </div>
    </Link>
  );
}
