"use client";

import Link from "next/link";
import { useApp, useT } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";
import type { BookMeta } from "@/lib/types";
import { FORM_KEYS } from "../lib/formKeys";
import { FORM_MOTIFS } from "../lib/formMotifs";
import { BookCover } from "./BookCover";

/** Top rules cycle coral · gold · ink so the drawn covers read as one rhythm. */
const RULES = ["border-t-accent", "border-t-gold", "border-t-ink"] as const;

const FRAME = "h-24 md:h-[150px]";

/**
 * One cover in the home strip: 96 px tall on mobile, 150 px on md+. A book with a photograph gets
 * the duotone image with its title on a solid ink band across the foot (a flat band, not a
 * gradient); a book without one keeps the typographic tile plus its form motif.
 */
export function StripCover({ book, index }: { book: BookMeta; index: number }) {
  const t = useT();
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;

  if (book.cover) {
    return (
      <Link href={`/library/${book.slug}`} className={`block ${FRAME} rounded-lg shadow-elevated`}>
        <BookCover cover={book.cover} className={`${FRAME} w-full`}>
          <span className="absolute inset-x-0 bottom-0 bg-cover-band px-2 py-1">
            <span className="block font-serif font-semibold text-xs md:text-sm leading-tight text-cover-band-text line-clamp-2" lang={locale}>
              {title}
            </span>
          </span>
        </BookCover>
      </Link>
    );
  }

  const Motif = FORM_MOTIFS[book.form];
  return (
    <Link
      href={`/library/${book.slug}`}
      className={`flex ${FRAME} flex-col justify-between overflow-hidden rounded-lg bg-elevated border border-line shadow-elevated border-t-[3px] ${RULES[index % RULES.length]} p-2 hover:bg-paper-edge`}
    >
      <span className="block font-serif font-semibold text-xs md:text-sm leading-normal text-ink line-clamp-3" lang={locale}>
        {title}
      </span>
      <span className="flex items-end justify-between gap-1">
        <Motif size={18} className="shrink-0 text-accent" />
        <span className="hidden md:block text-xs text-muted truncate">
          {formatEra(book.era, locale)} · {t(FORM_KEYS[book.form])}
        </span>
      </span>
    </Link>
  );
}
