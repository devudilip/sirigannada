"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MiniCover } from "@/features/library/components/MiniCover";
import { localiseDigits, readPercent } from "@/features/library/lib/readPercent";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { readProgress } from "@/features/reader/lib/settings";
import { pickLastReading, type LastReading } from "../lib/lastReading";

/** The most recently opened book: mini cover, title, author · page, and a sky progress line. */
export function ContinueReading() {
  const { locale, t } = useApp();
  const manifest = useBooksManifest();
  const [last, setLast] = useState<LastReading | null>(null);

  // Progress lives in localStorage; pick it after mount so server and client markup agree.
  useEffect(() => {
    if (manifest) setLast(pickLastReading(manifest.books, readProgress));
  }, [manifest]);

  if (!last) return null;

  const title = locale === "en" && last.book.titleEn ? last.book.titleEn : last.book.title;
  const author = locale === "en" && last.book.authorEn ? last.book.authorEn : last.book.author;
  const page = last.progress.page;
  const percent = readPercent(last.progress.block, last.book.blockCount);

  return (
    <section>
      <SectionHeading k="continueReading" />
      <Link href={`/library/${last.book.slug}`} className="grid grid-cols-[64px_1fr] gap-4 min-h-11 hover:bg-elevated active:bg-paper-edge">
        <MiniCover title={last.book.title} className="w-16 h-22" />
        <span className="flex min-w-0 flex-col justify-between py-1">
          <span className="min-w-0">
            <span className="block font-serif font-semibold text-lg leading-snug text-ink" lang={locale}>
              {title}
            </span>
            <span className="mt-1 block text-sm text-muted truncate">
              {author}
              {page != null ? ` · ${t("continuePage", { n: localiseDigits(page, locale) })}` : ""}
            </span>
          </span>
          <span aria-hidden="true" className="block h-0.5 w-full bg-paper-edge">
            <span className="block h-full bg-gold" style={{ width: `${percent}%` }} />
          </span>
        </span>
      </Link>
    </section>
  );
}
