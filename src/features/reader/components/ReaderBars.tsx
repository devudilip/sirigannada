"use client";

import Link from "next/link";
import { IconButton } from "@/components/ui/Button";
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, SlidersIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";

interface TopBarProps {
  visible: boolean;
  title: string;
  chapterTitle: string;
  bookmarked: boolean;
  onBookmark: () => void;
  onChapters: () => void;
  onSettings: () => void;
}

const barBase = "absolute inset-x-0 flex items-center gap-2 px-2 transition-opacity duration-200";

export function ReaderTopBar({ visible, title, chapterTitle, bookmarked, onBookmark, onChapters, onSettings }: TopBarProps) {
  const t = useT();
  return (
    <div className={`${barBase} top-0 h-14 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ color: "var(--sg-text)" }}>
      <Link href="/library" aria-label={t("navLibrary")} className="inline-flex items-center justify-center size-11 rounded-md hover:bg-paper-edge">
        <ChevronLeftIcon size={22} />
      </Link>
      <div className="flex-1 min-w-0 text-center">
        <p className="font-serif font-semibold text-base truncate" lang="kn">{title}</p>
        <p className="text-xs truncate" style={{ color: "var(--sg-text-secondary)" }} lang="kn">{chapterTitle}</p>
      </div>
      <IconButton onClick={onBookmark} aria-label={t("bookmark")} aria-pressed={bookmarked}>
        <BookmarkIcon size={22} filled={bookmarked} className={bookmarked ? "text-accent" : undefined} />
      </IconButton>
      <IconButton onClick={onChapters} aria-label={t("chapters")}>
        <ListIcon size={22} />
      </IconButton>
      <IconButton onClick={onSettings} aria-label={t("fontSize")}>
        <SlidersIcon size={22} />
      </IconButton>
    </div>
  );
}

interface BottomBarProps {
  visible: boolean;
  view: number;
  viewCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export function ReaderBottomBar({ visible, view, viewCount, onPrev, onNext }: BottomBarProps) {
  const t = useT();
  const pct = viewCount > 1 ? (view / (viewCount - 1)) * 100 : 100;
  return (
    <div className={`${barBase} bottom-0 h-14 safe-bottom ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ color: "var(--sg-text)" }}>
      <IconButton onClick={onPrev} aria-label={t("prevPage")} disabled={view <= 0}>
        <ChevronLeftIcon size={22} />
      </IconButton>
      <div className="flex-1 flex flex-col items-center gap-1.5">
        <span className="text-xs tabular-nums" style={{ color: "var(--sg-text-secondary)" }}>
          {t("pageOf", { n: view + 1, total: viewCount })}
        </span>
        <div className="w-full max-w-xs h-0.5 rounded-full" style={{ background: "var(--sg-paper-edge)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--sg-gold)" }} />
        </div>
      </div>
      <IconButton onClick={onNext} aria-label={t("nextPage")} disabled={view >= viewCount - 1}>
        <ChevronRightIcon size={22} />
      </IconButton>
    </div>
  );
}
