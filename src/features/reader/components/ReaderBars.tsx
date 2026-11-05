"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { IconButton } from "@/components/ui/Button";
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, MenuIcon, SearchIcon, ShareIcon, SlidersIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import type { CollectionItemInput } from "@/features/collections/types";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { spaceTicks } from "../lib/readerFooter";

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
  continueSlot?: ReactNode;
}

const barBase = "absolute inset-x-0 flex items-center gap-0 px-1 transition-opacity duration-200 sm:gap-2 sm:px-2";

export function ReaderTopBar({ visible, title, chapterTitle, bookmarked, onBookmark, onSearch, onChapters, onSettings, saveItem, continueSlot }: TopBarProps) {
  const t = useT();
  const [actionsOpen, setActionsOpen] = useState(false);
  return (
    <div className={`${barBase} top-0 h-14 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ color: "var(--sg-text)" }}>
      <Link href="/library" aria-label={t("navLibrary")} className="inline-flex items-center justify-center size-11 hover:bg-paper-edge">
        <ChevronLeftIcon size={22} />
      </Link>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-serif font-semibold text-sm leading-tight truncate" lang="kn">{title}</p>
        <p className="text-xs truncate" style={{ color: "var(--sg-text-secondary)" }} lang="kn">{chapterTitle}</p>
      </div>
      <IconButton onClick={onChapters} aria-label={t("chapters")}>
        <ListIcon size={22} />
      </IconButton>
      <IconButton onClick={onSettings} aria-label={t("readerSettings")}>
        <SlidersIcon size={22} />
      </IconButton>
      <div className="relative md:contents" onKeyDown={(event) => { if (event.key === "Escape") setActionsOpen(false); }}>
        <button type="button" aria-label={t("readerActions")} aria-expanded={actionsOpen} onClick={() => setActionsOpen(!actionsOpen)} className="size-11 flex items-center justify-center cursor-pointer rounded-md hover:bg-paper-edge md:hidden"><MenuIcon size={22} /></button>
        <div onClick={() => setActionsOpen(false)} className={`${actionsOpen ? "flex" : "hidden"} md:flex absolute right-0 top-full md:static z-30 items-center gap-1 rounded-md border border-line md:border-0 bg-paper md:bg-transparent p-2 md:p-0`}>
      <IconButton onClick={onBookmark} aria-label={t("bookmark")} aria-pressed={bookmarked}>
        <BookmarkIcon size={22} filled={bookmarked} className={bookmarked ? "text-accent" : undefined} />
      </IconButton>
      <SaveToCollectionButton item={saveItem} />
      <IconButton onClick={onSearch} aria-label={t("readerSearch")}>
        <SearchIcon size={22} />
      </IconButton>
          {continueSlot}
        </div>
      </div>
    </div>
  );
}

interface BottomBarProps {
  visible: boolean;
  view: number;
  viewCount: number;
  /** Chapter start positions along the track, as fractions 0..1 (see `tickFractions`). */
  ticks: number[];
  onPrev: () => void;
  onNext: () => void;
  onPassageActions: () => void;
  onSeek: (view: number) => void;
}

/** Chapter dots closer than this (a share of the track) are thinned out. */
const MIN_TICK_GAP = 0.04;

/**
 * Page "ಪುಟ ೧೨ / ೪೭" centred over a 4 px rounded track with a gold fill and small muted dots
 * where chapters begin. Kannada digits when the UI is in Kannada. The book's licence and source
 * live under the chapter list (ReaderBookCredit) and on its last page.
 */
export function ReaderBottomBar({ visible, view, viewCount, ticks, onPrev, onNext, onPassageActions, onSeek }: BottomBarProps) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className={`${barBase} bottom-0 h-20 safe-bottom ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ color: "var(--sg-text)" }}>
      <IconButton onClick={onPrev} aria-label={t("prevPage")} disabled={view <= 0}>
        <ChevronLeftIcon size={22} />
      </IconButton>
      <div className="flex-1 min-w-0 flex flex-col items-center px-1">
        <span className="text-base leading-none tabular-nums" style={{ color: "var(--sg-text-secondary)" }} lang={locale}>
          {t("pageOf", { n: localiseDigits(view + 1, locale), total: localiseDigits(viewCount, locale) })}
        </span>
        <div className="relative w-full h-11">
          <input type="range" min={1} max={Math.max(1, viewCount)} value={view + 1} onChange={(event) => onSeek(Number(event.target.value) - 1)} aria-label={t("readerSeek")} aria-valuetext={t("pageOf", { n: localiseDigits(view + 1, locale), total: localiseDigits(viewCount, locale) })} className="w-full h-11 cursor-pointer" style={{ accentColor: "var(--sg-accent-strong)" }} />
          {spaceTicks(ticks, MIN_TICK_GAP).map((fraction) => <span aria-hidden="true" key={fraction} className="pointer-events-none absolute top-1/2 size-1 rounded-full" style={{ left: `${fraction * 100}%`, background: "var(--sg-text-muted)" }} />)}
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
