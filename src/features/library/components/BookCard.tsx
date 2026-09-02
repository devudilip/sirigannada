"use client";

import Link from "next/link";
import type { BookMeta } from "@/lib/types";
import { useApp } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";
import { Cover } from "./Cover";

/** A book on the shelf: typographic cover generated from title, author, and slug. */
export function BookCard({ book }: { book: BookMeta }) {
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;

  return (
    <Link
      href={`/library/${book.slug}`}
      className="group relative flex h-44 md:h-52 rounded-lg overflow-hidden border border-line transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <Cover
        slug={book.slug}
        title={title}
        author={author}
        era={formatEra(book.era, locale)}
        lang={locale}
      />
    </Link>
  );
}
