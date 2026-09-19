"use client";

import Link from "next/link";
import { CheckIcon, VolumeIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { PictureBookMeta } from "@/lib/types";
import { bookTitle } from "../lib/display";
import { useBookCached } from "../lib/offline";

/** One cover in the hub grid: square-ish image, serif title, "ಹಂತ ೧ · 8 ಪುಟ" meta, narration and on-device marks. */
export function PicturebookCard({ book, cacheTick = 0 }: { book: PictureBookMeta; cacheTick?: number }) {
  const { locale, t } = useApp();
  const cached = useBookCached(book.slug, cacheTick);
  const title = bookTitle(book, locale);

  return (
    <Link
      href={`/picturebooks/${book.slug}`}
      className="group flex flex-col gap-2 rounded-lg p-2 -m-2"
    >
      <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-elevated shadow-lift transition-transform duration-200 group-hover:-translate-y-1">
        {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
        <img src={book.cover.src} alt="" className="block size-full object-cover" loading="lazy" />
        {book.audio && (
          <span aria-hidden="true" className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full bg-ink/60 text-white">
            <VolumeIcon size={16} />
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-serif font-semibold text-[17px] leading-snug text-ink line-clamp-2" lang={locale}>
          {title}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1 text-[13px] text-muted">
          <span lang={locale}>{t("picturebooksLevel", { n: localiseDigits(Number(book.level), locale) })}</span>
          <span aria-hidden="true">·</span>
          <span lang={locale}>{t("picturebooksPages", { n: localiseDigits(book.pageCount, locale) })}</span>
          {cached ? (
            <span className="inline-flex items-center gap-0.5 text-ink" title={t("storiesOnDevice")}>
              <CheckIcon size={12} />
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}
