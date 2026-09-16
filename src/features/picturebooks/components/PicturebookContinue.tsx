"use client";

import { PlayIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { PictureBookMeta } from "@/lib/types";
import { bookTitle } from "../lib/display";
import type { PicturebookProgress } from "../lib/progress";

/** "ಮುಂದುವರಿಸಿ · Continue": the most recently opened, unfinished book, with a big Read button. */
export function PicturebookContinue({ book, progress }: { book: PictureBookMeta; progress: PicturebookProgress }) {
  const { locale, t } = useApp();

  return (
    <section aria-labelledby="picturebooks-continue">
      <SectionHeading k="picturebooksContinue" />
      <Card className="grid grid-cols-[100px_1fr] items-center gap-5 p-4 shadow-lift">
        <span className="block aspect-[4/5] overflow-hidden rounded-lg bg-elevated shadow-lift">
          {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
          <img src={book.cover.src} alt="" className="block size-full object-cover" />
        </span>
        <div className="min-w-0 flex flex-col gap-3">
          <h3 id="picturebooks-continue" className="font-serif font-semibold text-[19px] leading-snug text-ink" lang={locale}>
            {bookTitle(book, locale)}
          </h3>
          <p className="text-sm text-muted" lang={locale}>
            {t("picturebooksPageOf", { n: localiseDigits(progress.page + 1, locale), total: localiseDigits(progress.pageCount, locale) })}
          </p>
          <LinkButton href={`/picturebooks/${book.slug}`} size="lg" className="h-13 px-6 text-lg self-start rounded-full bg-accent-lit shadow-lift">
            <PlayIcon size={20} />
            <span lang="kn">{t("picturebooksRead")}</span>
          </LinkButton>
        </div>
      </Card>
    </section>
  );
}
