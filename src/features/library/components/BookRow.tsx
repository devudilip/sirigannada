"use client";

import Link from "next/link";
import { CheckIcon, DownloadIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";
import type { BookMeta } from "@/lib/types";
import type { Progress } from "@/features/reader/types";
import { FORM_KEYS } from "../lib/formKeys";
import { localiseDigits, readPercent } from "../lib/readPercent";
import { MiniCover } from "./MiniCover";

/**
 * One shelf row on a 1 px rule: 52×68 cover, serif title, muted meta, and on the right either a
 * sky progress bar with the percent read or an on-device / not-downloaded mark.
 */
export function BookRow({
  book,
  progress,
  cached,
}: {
  book: BookMeta;
  progress: Progress | null;
  /** `null` while the cache has not been read yet — nothing is shown then. */
  cached: boolean | null;
}) {
  const t = useT();
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;
  const percent = progress ? readPercent(progress.block, book.blockCount) : null;

  return (
    <Link
      href={`/library/${book.slug}`}
      className="rule-row grid grid-cols-[52px_1fr_auto] items-center gap-4 py-4 min-h-11 hover:bg-elevated active:bg-paper-edge"
    >
      <MiniCover title={book.title} className="w-13 h-17" />
      <span className="min-w-0">
        <span className="block font-serif font-semibold text-base leading-snug text-ink" lang={locale}>
          {title}
        </span>
        <span className="mt-1 block text-sm text-muted truncate">
          {author} · {formatEra(book.era, locale)} · {t(FORM_KEYS[book.form])} · {localiseDigits(book.blockCount, locale)}
        </span>
      </span>
      {percent !== null ? (
        <span className="flex flex-col items-end gap-1.5" aria-label={t("libraryPercentRead", { n: localiseDigits(percent, locale) })}>
          <span className="text-sm text-muted">{localiseDigits(percent, locale)}%</span>
          <span aria-hidden="true" className="block w-30 h-1 overflow-hidden rounded-full bg-paper-edge">
            <span className="block h-full bg-gold" style={{ width: `${percent}%` }} />
          </span>
        </span>
      ) : cached === null ? null : cached ? (
        <CheckIcon size={20} className="text-ink" aria-label={t("libraryOnDevice")} role="img" aria-hidden={false} />
      ) : (
        <DownloadIcon size={20} className="text-muted" aria-label={t("libraryNotOnDevice")} role="img" aria-hidden={false} />
      )}
    </Link>
  );
}
