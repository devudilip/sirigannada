"use client";

import Link from "next/link";
import type { Book, DictEntry } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import { EntryCard } from "@/features/dictionary/components/EntryCard";
import { FONT_SCALE_MAX, FONT_SCALE_MIN, type Paper, type ReaderSettings } from "../types";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onStepFont: (dir: 1 | -1) => void;
  onUpdate: (patch: Partial<ReaderSettings>) => void;
}

const PAPERS: Paper[] = ["light", "sepia", "night"];

export function SettingsSheet({ open, onClose, settings, onStepFont, onUpdate }: SettingsSheetProps) {
  const t = useT();
  const paperLabel: Record<Paper, string> = { light: t("paperLight"), sepia: t("paperSepia"), night: t("paperNight") };
  return (
    <Sheet open={open} onClose={onClose} title={t("fontSize")}>
      <div className="flex flex-col gap-6 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-secondary">{t("fontSize")}</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => onStepFont(-1)} disabled={settings.fontScale <= FONT_SCALE_MIN} aria-label="-">
              <span className="font-serif text-sm">ಅ</span>
            </Button>
            <span className="w-12 text-center tabular-nums text-sm text-secondary">{Math.round(settings.fontScale * 100)}%</span>
            <Button variant="secondary" onClick={() => onStepFont(1)} disabled={settings.fontScale >= FONT_SCALE_MAX} aria-label="+">
              <span className="font-serif text-xl">ಅ</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">{t("paper")}</span>
          <div className="flex gap-2">
            {PAPERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onUpdate({ paper: p })}
                aria-pressed={settings.paper === p}
                className={`h-10 px-4 rounded-full text-sm font-medium border transition-colors ${
                  settings.paper === p ? "bg-accent text-on-accent border-accent" : "bg-elevated text-ink border-line hover:border-line-strong"
                }`}
              >
                {paperLabel[p]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Aa</span>
          <div className="flex gap-2">
            {(["serif", "sans"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onUpdate({ font: f })}
                aria-pressed={settings.font === f}
                className={`h-10 px-4 rounded-full text-sm border transition-colors ${f === "serif" ? "font-serif" : "font-sans"} ${
                  settings.font === f ? "bg-accent text-on-accent border-accent" : "bg-elevated text-ink border-line hover:border-line-strong"
                }`}
              >
                ಕನ್ನಡ
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

interface ChaptersSheetProps {
  open: boolean;
  onClose: () => void;
  book: Book;
  currentChapter: number;
  hasBookmark: boolean;
  onSelect: (chapterIndex: number) => void;
  onGoToBookmark: () => void;
}

export function ChaptersSheet({ open, onClose, book, currentChapter, hasBookmark, onSelect, onGoToBookmark }: ChaptersSheetProps) {
  const t = useT();
  return (
    <Sheet open={open} onClose={onClose} title={t("chapters")}>
      {hasBookmark && (
        <Button variant="secondary" className="w-full mb-3" onClick={onGoToBookmark}>
          {t("bookmark")}
        </Button>
      )}
      <ol className="flex flex-col">
        {book.chapters.map((ch, i) => (
          <li key={ch.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={i === currentChapter ? "true" : undefined}
              className={`w-full text-left px-3 py-3 rounded-md font-serif text-base transition-colors ${
                i === currentChapter ? "text-accent bg-accent-soft" : "text-ink hover:bg-paper"
              }`}
              lang="kn"
            >
              {ch.title}
            </button>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

interface LookupSheetProps {
  word: string | null;
  entry: DictEntry | null | undefined;
  onClose: () => void;
}

export function LookupSheet({ word, entry, onClose }: LookupSheetProps) {
  const t = useT();
  return (
    <Sheet open={word !== null} onClose={onClose} title={word ?? ""}>
      {entry === undefined && <p className="text-secondary py-4">{t("loading")}</p>}
      {entry === null && <p className="text-secondary py-4">{t("noResults")}</p>}
      {entry && <EntryCard entry={entry} compact />}
      {word && (
        <Link href={`/dictionary?q=${encodeURIComponent(word)}`} className="inline-flex mt-4 text-sm font-medium text-accent hover:underline">
          {t("navDictionary")} →
        </Link>
      )}
    </Sheet>
  );
}
