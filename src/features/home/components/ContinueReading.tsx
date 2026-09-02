"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { readProgress } from "@/features/reader/lib/settings";
import { pickLastReading } from "../lib/lastReading";

export function ContinueReading() {
  const t = useT();
  const { locale } = useApp();
  const manifest = useBooksManifest();
  if (!manifest) return null;

  const last = pickLastReading(manifest.books, readProgress);
  if (!last) return null;

  const title = locale === "en" && last.book.titleEn ? last.book.titleEn : last.book.title;
  const author = locale === "en" && last.book.authorEn ? last.book.authorEn : last.book.author;
  const page = last.progress.page;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ink mb-4">{t("continueReading")}</h2>
      <Link
        href={`/library/${last.book.slug}`}
        className="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3 min-h-11 hover:border-accent"
      >
        <span aria-hidden="true" className="w-1.5 self-stretch rounded-full bg-accent shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-serif font-semibold text-ink truncate" lang="kn">
            {title}
          </span>
          <span className="block text-sm text-secondary truncate">
            {author}
            {page != null ? ` · ${t("continuePage", { n: page })}` : ""}
          </span>
        </span>
        <ArrowRightIcon size={20} className="text-accent shrink-0" />
      </Link>
    </section>
  );
}
