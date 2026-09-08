"use client";

import Link from "next/link";
import { useApp, useT } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";
import type { BookMeta } from "@/lib/types";
import { FORM_KEYS } from "../lib/formKeys";

/** One cover in the home strip: 96 px tall on mobile, 150 px with era · form on md+. */
const RULES = ["border-t-accent", "border-t-gold", "border-t-ink"] as const;

/** Top rules cycle coral · gold · ink so the shelf reads as one rhythm. */
export function StripCover({ book, index }: { book: BookMeta; index: number }) {
  const t = useT();
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  return (
    <Link
      href={`/library/${book.slug}`}
      className={`flex h-24 md:h-[150px] flex-col justify-between overflow-hidden rounded-lg bg-elevated border border-line shadow-elevated border-t-[3px] ${RULES[index % RULES.length]} p-2 hover:bg-paper-edge`}
    >
      <span className="block font-serif font-semibold text-xs md:text-sm leading-normal text-ink line-clamp-3" lang={locale}>
        {title}
      </span>
      <span className="hidden md:block text-xs text-muted truncate">
        {formatEra(book.era, locale)} · {t(FORM_KEYS[book.form])}
      </span>
    </Link>
  );
}
