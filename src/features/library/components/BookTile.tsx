"use client";

import Link from "next/link";
import { CheckIcon, DownloadIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { formatEra } from "@/lib/kannada";
import type { BookMeta } from "@/lib/types";
import type { Progress } from "@/features/reader/types";
import { FORM_KEYS } from "../lib/formKeys";
import { localiseDigits, readPercent } from "../lib/readPercent";
import type { SectionFilter } from "../types";
import { BookCover } from "./BookCover";
import { MiniCover } from "./MiniCover";

const BOX = "group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper transition-colors hover:border-accent active:bg-paper-edge";
const COVER = "aspect-[3/4] w-full rounded-none";

/** How a section box fills its 3:4 cover frame. */
export type ShelfTileCover =
  /** Six-panel storyboard; panel 1 is cropped to the frame. */
  | { kind: "storyboard"; image: string; alt: string }
  /** A plain picture (a 16:9 story cover), object-fit cover. */
  | { kind: "picture"; image: string; alt: string }
  /** No picture yet: the title set in serif on gold. */
  | { kind: "text" };

/** A shelf entry that is not a book (ಚಿತ್ರಕಥೆ, ಕರ್ನಾಟಕ ಇತಿಹಾಸ): a box with a filter chip of its own. */
export interface ShelfTile {
  id: SectionFilter;
  href: string;
  title: string;
  sub: string;
  cover: ShelfTileCover;
}

/**
 * One book as a box in the library grid: the 3:4 cover (the duotone photograph, or the drawn form
 * motif), the serif title, author and era, and at the foot either the percent read or whether the
 * book is on this device.
 */
export function BookTile({ book, progress, cached }: { book: BookMeta; progress: Progress | null; cached: boolean | null }) {
  const t = useT();
  const { locale } = useApp();
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;
  const percent = progress ? readPercent(progress.block, book.blockCount) : null;

  return (
    <Link href={`/library/${book.slug}`} className={BOX}>
      {book.cover ? <BookCover cover={book.cover} className={COVER} /> : <MiniCover title={book.title} form={book.form} className={COVER} />}
      <span className="flex flex-1 flex-col gap-1 p-3">
        <span className="font-serif text-base font-semibold leading-snug text-ink line-clamp-2" lang={locale}>{title}</span>
        <span className="text-sm text-muted line-clamp-2">{author} · {formatEra(book.era, locale)} · {t(FORM_KEYS[book.form])}</span>
        <span className="mt-auto flex items-center justify-end pt-1">
          {percent !== null ? (
            <span className="flex w-full items-center gap-2" aria-label={t("libraryPercentRead", { n: localiseDigits(percent, locale) })}>
              <span aria-hidden="true" className="block h-1 flex-1 overflow-hidden rounded-full bg-paper-edge">
                <span className="block h-full bg-gold" style={{ width: `${percent}%` }} />
              </span>
              <span className="text-sm text-muted">{localiseDigits(percent, locale)}%</span>
            </span>
          ) : cached === null ? null : cached ? (
            <CheckIcon size={18} className="text-ink" aria-label={t("libraryOnDevice")} role="img" aria-hidden={false} />
          ) : (
            <DownloadIcon size={18} className="text-muted" aria-label={t("libraryNotOnDevice")} role="img" aria-hidden={false} />
          )}
        </span>
      </span>
    </Link>
  );
}

/** A section box: same frame as a book, the cover drawn as the tile's `cover` kind says. */
export function SectionTile({ tile }: { tile: ShelfTile }) {
  const { cover } = tile;
  return (
    <Link href={tile.href} className={BOX}>
      {cover.kind === "storyboard" ? (
        <span
          role="img"
          aria-label={cover.alt}
          lang="kn"
          className={`block bg-paper bg-no-repeat ${COVER}`}
          // A square panel filling a 3:4 frame: scale the 2×3 sheet to the frame's height and centre panel 1.
          style={{ backgroundImage: `url(${cover.image})`, backgroundSize: "266.67% 300%", backgroundPosition: "10% 0%" }}
        />
      ) : cover.kind === "picture" ? (
        <span className={`block overflow-hidden bg-elevated ${COVER}`}>
          <img src={cover.image} alt={cover.alt} width={480} height={640} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </span>
      ) : (
        <span aria-hidden="true" className={`flex items-center justify-center bg-gold-soft px-3 text-center font-serif text-lg font-bold leading-tight text-ink ${COVER}`} lang="kn">
          {tile.title}
        </span>
      )}
      <span className="flex flex-1 flex-col gap-1 p-3">
        <span className="font-serif text-base font-semibold leading-snug text-ink" lang="kn">{tile.title}</span>
        <span className="text-sm text-muted line-clamp-2" lang="kn">{tile.sub}</span>
      </span>
    </Link>
  );
}
