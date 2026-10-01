"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { ChevronLeftIcon } from "@/components/icons";
import { ContinueButton } from "@/features/continue/components/ContinueButton";
import type { StringKey } from "@/lib/i18n";
import { PracticeFlashcards } from "./PracticeFlashcards";
import { PracticeGunita } from "./PracticeGunita";
import { PracticeLetterQuiz } from "./PracticeLetterQuiz";
import { PracticeMatch } from "./PracticeMatch";

type Mode = "hear" | "first" | "match" | "gunita" | "flashcards";

const MODES: { mode: Mode; titleKey: StringKey; subKey: StringKey }[] = [
  { mode: "hear", titleKey: "practiceModeHearLetter", subKey: "practiceModeHearLetterSub" },
  { mode: "first", titleKey: "practiceModeFirstLetter", subKey: "practiceModeFirstLetterSub" },
  { mode: "match", titleKey: "practiceModeMatch", subKey: "practiceModeMatchSub" },
  { mode: "gunita", titleKey: "practiceModeGunita", subKey: "practiceModeGunitaSub" },
  { mode: "flashcards", titleKey: "practiceModeFlashcards", subKey: "practiceModeFlashcardsSub" },
];

/**
 * Top of the /learn/practice route: a menu of practice modes, or the running mode with a way
 * back. Drills only — the daily word game and the crossword live under /games.
 */
export function PracticeHub() {
  const t = useT();
  const [mode, setMode] = useState<Mode | null>(null);

  // A continue link from another device lands on /learn/practice#<mode> — reopen that mode.
  useEffect(() => {
    const fromHash = MODES.find((m) => m.mode === window.location.hash.slice(1));
    if (fromHash) setMode(fromHash.mode);
  }, []);

  if (mode === null) {
    return (
      <ul className="rule-section">
        {MODES.map((entry) => (
          <li key={entry.mode}>
            <button
              type="button"
              onClick={() => setMode(entry.mode)}
              className="group flex w-full items-center justify-between gap-4 rule-row py-3 min-h-14 text-left transition-colors hover:bg-elevated active:bg-paper-edge"
            >
              <span className="flex flex-col gap-1 min-w-0">
                <span className="text-lg font-semibold text-ink">{t(entry.titleKey)}</span>
                <span className="text-sm text-secondary">{t(entry.subKey)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => setMode(null)}
        className="inline-flex items-center gap-1 self-start text-sm font-medium text-secondary hover:text-ink"
      >
        <ChevronLeftIcon size={18} />
        {t("practiceBack")}
      </button>
      {(mode === "hear" || mode === "first") && <PracticeLetterQuiz key={mode} kind={mode} />}
      {mode === "match" && <PracticeMatch />}
      {mode === "gunita" && <PracticeGunita />}
      {mode === "flashcards" && <PracticeFlashcards />}
      <ContinueButton page={`/learn/practice#${mode}`} className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-line px-3 py-2 text-base text-ink hover:border-accent" />
    </div>
  );
}
