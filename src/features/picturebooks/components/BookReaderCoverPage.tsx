"use client";

import { CheckIcon, DownloadIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import type { PictureBook } from "@/lib/types";

/** First page of the strip: the cover art, title, byline, and (offline) the save-on-device button. */
export function BookReaderCoverPage({
  book,
  cached,
  saving,
  onSave,
}: {
  book: PictureBook;
  cached: boolean | null;
  saving: boolean;
  onSave: () => void;
}) {
  const { locale, t } = useApp();
  const authors = book.provenance.authors.join(", ");
  const illustrators = book.provenance.illustrators.join(", ");

  return (
    <div className="h-full w-full shrink-0 snap-center overflow-y-auto bg-surface flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <span className="block max-h-[55dvh] max-w-full overflow-hidden rounded-lg border border-line shadow-elevated bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
        <img src={book.cover.src} alt="" className="block max-h-[55dvh] w-auto object-contain" />
      </span>
      <h1 lang={locale} className="font-serif text-2xl font-bold text-ink">
        {locale === "en" && book.titleEn ? book.titleEn : book.title}
      </h1>
      <p className="text-sm text-secondary">
        {authors && (
          <span>
            {t("picturebooksBy")} {authors}
          </span>
        )}
        {authors && illustrators && <span aria-hidden="true"> · </span>}
        {illustrators && (
          <span>
            {t("picturebooksIllustratedBy")} {illustrators}
          </span>
        )}
        {book.provenance.publisher && (
          <>
            <br />
            <span>
              {t("picturebooksPublishedBy")} {book.provenance.publisher}
            </span>
          </>
        )}
      </p>
      {cached === false && (
        <Button variant="secondary" onClick={onSave} disabled={saving}>
          <DownloadIcon size={18} />
          {t("picturebooksSaveOnDevice")}
        </Button>
      )}
      {cached === true && (
        <p className="inline-flex items-center gap-1 text-sm text-ink">
          <CheckIcon size={16} />
          {t("storiesOnDevice")}
        </p>
      )}
    </div>
  );
}
