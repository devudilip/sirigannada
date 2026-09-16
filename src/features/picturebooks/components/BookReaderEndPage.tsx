"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useApp } from "@/components/providers/AppProviders";
import type { PictureBook } from "@/lib/types";

/**
 * Final page: "The end", two big choices (read again, another book), the one-line CC BY credit
 * that must travel with the story, and a link to the book's full credits page.
 */
export function BookReaderEndPage({ book, onReadAgain }: { book: PictureBook; onReadAgain: () => void }) {
  const { locale, t } = useApp();
  const p = book.provenance;
  const byline = [
    p.authors.length ? `${t("picturebooksBy")} ${p.authors.join(", ")}` : null,
    p.illustrators.length ? `${t("picturebooksIllustratedBy")} ${p.illustrators.join(", ")}` : null,
    p.publisher ? `${t("picturebooksPublishedBy")} ${p.publisher}` : null,
  ].filter(Boolean);

  return (
    <div className="h-full w-full shrink-0 snap-center overflow-y-auto bg-surface flex flex-col items-center justify-center px-6 pt-16 pb-reader-bar text-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
        <p className="kicker text-accent-strong">{t("picturebooksTheEnd")}</p>
        <h2 lang={locale} className="font-serif text-2xl font-bold text-ink">
          {locale === "en" && book.titleEn ? book.titleEn : book.title}
        </h2>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={onReadAgain} className="justify-center rounded-full px-7 bg-accent-lit shadow-lift">
            {t("picturebooksReadAgain")}
          </Button>
          <LinkButton href="/picturebooks" variant="secondary" size="lg" className="justify-center rounded-full px-7">
            {t("picturebooksAnotherBook")}
          </LinkButton>
        </div>
        <p className="mt-4 text-sm text-secondary" lang={locale}>
          {byline.join(" · ")}
        </p>
        <p className="text-xs text-muted">
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
            {t("licenseCCBY")}
          </a>
          {" · "}
          <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline">
            StoryWeaver
          </a>
          {" · "}
          <Link href={`/picturebooks/${book.slug}/credits`} className="underline text-accent-strong">
            {t("picturebooksAllCredits")} →
          </Link>
        </p>
      </div>
    </div>
  );
}
