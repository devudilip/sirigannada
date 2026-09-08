"use client";

import Link from "next/link";
import { IconButton } from "@/components/ui/Button";
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, SearchIcon, ShareIcon, SlidersIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import type { CollectionItemInput } from "@/features/collections/types";
import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";

interface TopBarProps {
  visible: boolean;
  title: string;
  chapterTitle: string;
  bookmarked: boolean;
  onBookmark: () => void;
  onSearch: () => void;
  onChapters: () => void;
  onSettings: () => void;
  saveItem: CollectionItemInput;
}

const barBase = "absolute inset-x-0 flex items-center gap-0 px-1 transition-opacity duration-200 sm:gap-2 sm:px-2";

export function ReaderTopBar({ visible, title, chapterTitle, bookmarked, onBookmark, onSearch, onChapters, onSettings, saveItem }: TopBarProps) {
  const t = useT();
  return (
    <div className={`${barBase} top-0 h-14 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ color: "var(--sg-text)" }}>
      <Link href="/library" aria-label={t("navLibrary")} className="inline-flex items-center justify-center size-11 hover:bg-paper-edge">
        <ChevronLeftIcon size={22} />
      </Link>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-serif font-semibold text-sm leading-tight truncate" lang="kn">{title}</p>
        <p className="text-xs truncate" style={{ color: "var(--sg-text-secondary)" }} lang="kn">{chapterTitle}</p>
      </div>
      <IconButton onClick={onBookmark} aria-label={t("bookmark")} aria-pressed={bookmarked}>
        <BookmarkIcon size={22} filled={bookmarked} className={bookmarked ? "text-accent" : undefined} />
      </IconButton>
      <SaveToCollectionButton item={saveItem} />
      <IconButton onClick={onSearch} aria-label={t("readerSearch")}>
        <SearchIcon size={22} />
      </IconButton>
      <IconButton onClick={onChapters} aria-label={t("chapters")}>
        <ListIcon size={22} />
      </IconButton>
      <IconButton onClick={onSettings} aria-label={t("readerSettings")}>
        <SlidersIcon size={22} />
      </IconButton>
    </div>
  );
}

interface BottomBarProps {
  visible: boolean;
  view: number;
  viewCount: number;
  /** Chapter start positions along the track, as fractions 0..1 (see `tickFractions`). */
  ticks: number[];
  /** Localised licence label, e.g. "Public domain". */
  licenseLabel: string;
  /** Host of the book's source URL, e.g. "kn.wikisource.org". */
  sourceHost: string;
  onPrev: () => void;
  onNext: () => void;
  onPassageActions: () => void;
}

/**
 * Page "ಪುಟ ೧೨ / ೪೭" left, licence · source right, over a 2 px track with a sky fill and
 * 2×8 px ink ticks where chapters begin. Kannada digits when the UI is in Kannada.
 */
export function ReaderBottomBar({ visible, view, viewCount, ticks, licenseLabel, sourceHost, onPrev, onNext, onPassageActions }: BottomBarProps) {
  const t = useT();
  const { locale } = useApp();
  const pct = viewCount > 1 ? (view / (viewCount - 1)) * 100 : 100;
  const n = (value: number) => (locale === "kn" ? arabicToKannadaDigits(String(value)) : String(value));
  return (
    <div className={`${barBase} bottom-0 h-14 safe-bottom ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ color: "var(--sg-text)" }}>
      <IconButton onClick={onPrev} aria-label={t("prevPage")} disabled={view <= 0}>
        <ChevronLeftIcon size={22} />
      </IconButton>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3 text-xs" style={{ color: "var(--sg-text-secondary)" }}>
          <span className="tabular-nums shrink-0">{t("pageOf", { n: n(view + 1), total: n(viewCount) })}</span>
          <span className="truncate" lang="en">
            {licenseLabel}
            {sourceHost ? ` · ${sourceHost}` : ""}
          </span>
        </div>
        <div className="relative w-full h-2" aria-hidden="true">
          <div className="absolute inset-x-0 top-[3px] h-0.5" style={{ background: "var(--sg-paper-edge)" }}>
            <div className="h-full" style={{ width: `${pct}%`, background: "var(--sg-gold)" }} />
          </div>
          {ticks.map((fraction) => (
            <span
              key={fraction}
              className="absolute top-0 h-2 w-0.5 -ml-px"
              style={{ left: `${fraction * 100}%`, background: "var(--sg-text)" }}
            />
          ))}
        </div>
      </div>
      <IconButton onClick={onPassageActions} aria-label={t("currentPassageActions")}>
        <ShareIcon size={20} />
      </IconButton>
      <IconButton onClick={onNext} aria-label={t("nextPage")} disabled={view >= viewCount - 1}>
        <ChevronRightIcon size={22} />
      </IconButton>
    </div>
  );
}
