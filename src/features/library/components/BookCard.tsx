"use client";

import Link from "next/link";
import type { BookMeta } from "@/lib/types";
import { useApp } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";

/** A book on the shelf: paper-coloured cover with a red spine, title and author in the serif face. */
export function BookCard({ book }: { book: BookMeta }) {
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;

  return (
    <Link
      href={`/library/${book.slug}`}
      className="group relative flex h-44 md:h-52 rounded-lg overflow-hidden border border-line bg-paper transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <span aria-hidden="true" className="w-2.5 shrink-0 bg-accent" />
      <span className="flex flex-col justify-between p-4 min-w-0">
        <span className="flex flex-col gap-1 min-w-0">
          <span className="font-serif font-semibold text-ink text-lg leading-snug line-clamp-3" lang="kn">
            {title}
          </span>
          <span className="text-sm text-secondary truncate">{author}</span>
        </span>
        <span className="text-xs text-muted">{formatEra(book.era, locale)}</span>
      </span>
    </Link>
  );
}
