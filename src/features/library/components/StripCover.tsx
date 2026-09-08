"use client";

import Link from "next/link";
import { useApp, useT } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";
import type { BookMeta } from "@/lib/types";
import { FORM_KEYS } from "../lib/formKeys";

/** One cover in the home strip: 96 px tall on mobile, 150 px with era · form on md+. */
export function StripCover({ book, accent }: { book: BookMeta; accent: boolean }) {
  const t = useT();
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  return (
    <Link
      href={`/library/${book.slug}`}
      className={`flex h-24 md:h-[150px] flex-col justify-between overflow-hidden bg-elevated border-t-[3px] ${accent ? "border-accent" : "border-ink"} p-2 hover:bg-paper-edge`}
    >
      <span className="block font-serif font-semibold text-xs md:text-sm leading-tight text-ink line-clamp-3" lang={locale}>
        {title}
      </span>
      <span className="hidden md:block text-xs text-muted truncate">
        {formatEra(book.era, locale)} · {t(FORM_KEYS[book.form])}
      </span>
    </Link>
  );
}
