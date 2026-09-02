"use client";

import Link from "next/link";
import type { BookMeta } from "@/lib/types";
import { useApp, useT } from "@/components/providers/AppProviders";
import { licenseLabelKey } from "../lib/licenseLabel";

export function BookCredit({ book }: { book: BookMeta }) {
  const t = useT();
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;
  const died = book.provenance.authorDied;

  return (
    <li className="border-b border-line py-4 last:border-b-0">
      <Link
        href={`/library/${book.slug}`}
        className="font-serif font-semibold text-ink hover:text-accent"
        lang={locale === "en" && book.titleEn ? "en" : "kn"}
      >
        {title}
      </Link>
      <p className="mt-1 text-sm text-secondary">
        <span lang={locale === "en" && book.authorEn ? "en" : "kn"}>{author}</span>
        {died != null && (
          <>
            {" · "}
            {t("authorDied", { year: died })}
          </>
        )}
      </p>
      <p className="mt-1 text-sm text-muted">
        {t("license")}: {t(licenseLabelKey(book.provenance.license))}
        {" · "}
        <a className="text-accent underline" href={book.provenance.source} rel="noopener noreferrer">
          {t("source")}
        </a>
      </p>
    </li>
  );
}
