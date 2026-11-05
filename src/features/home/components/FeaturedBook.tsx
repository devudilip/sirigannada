"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { BookCover } from "@/features/library/components/BookCover";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";

/** A real place and a real book introduce the library, without decorative stock photography. */
export function FeaturedBook() {
  const { locale, t } = useApp();
  const manifest = useBooksManifest();
  const book = manifest?.books.find((item) => item.slug === "aluru-karnataka-gatavaibhava");
  if (!book?.cover) return <div className="rounded-lg bg-paper-edge animate-pulse aspect-video md:aspect-square" aria-hidden="true" />;
  return (
    <Link href={`/library/${book.slug}`} className="group grid grid-cols-3 lg:block overflow-hidden rounded-lg border border-line bg-elevated">
      <BookCover natural cover={book.cover} className="w-full h-full lg:h-auto lg:aspect-[4/3] rounded-none" />
      <div className="col-span-2 p-4 lg:p-6">
        <p className="text-base text-secondary">{t("homeFeaturedBook")}</p>
        <h2 className="mt-1 font-serif text-lg lg:text-xl font-semibold" lang={locale}>{locale === "en" && book.titleEn ? book.titleEn : book.title}</h2>
        <p className="mt-1 text-base text-secondary">{locale === "en" && book.authorEn ? book.authorEn : book.author}</p>
        <span className="mt-1 lg:mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-strong">{t("homeStartReading")}<ArrowRightIcon size={18} /></span>
      </div>
    </Link>
  );
}
