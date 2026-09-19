"use client";

import Link from "next/link";
import type { BookMeta } from "@/lib/types";
import { useApp, useT } from "@/components/providers/AppProviders";
import { licenseLabelKey } from "../lib/licenseLabel";

/**
 * Attribution for every cover photograph on the shelf: what the picture shows, who took it, and
 * the licence, linking to the Wikimedia Commons file page. Renders nothing while no book has one.
 */
export function CoverCredits({ books }: { books: BookMeta[] }) {
  const t = useT();
  const { locale } = useApp();
  const withCover = books.filter((b) => b.cover);
  if (withCover.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">{t("creditsCovers")}</h2>
      <p className="mt-1 text-sm text-secondary">{t("creditsCoversSub")}</p>
      <ul className="mt-2">
        {withCover.map((book) => {
          const cover = book.cover;
          if (!cover) return null;
          const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
          return (
            <li key={book.slug} className="border-b border-line py-4 last:border-b-0">
              <Link
                href={`/library/${book.slug}`}
                className="font-serif font-semibold text-ink hover:text-accent"
                lang={locale === "en" && book.titleEn ? "en" : "kn"}
              >
                {title}
              </Link>
              <p className="mt-1 text-sm text-secondary" lang={locale}>
                {cover.alt[locale]}
              </p>
              <p className="mt-1 text-sm text-muted">
                {t("creditsCoverPhotographer")}: {cover.provenance.author ?? "—"}
                {" · "}
                <a className="text-accent underline" href={cover.provenance.source} rel="noopener noreferrer">
                  {t(licenseLabelKey(cover.provenance.license))}
                </a>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
