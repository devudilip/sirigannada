"use client";

import { useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { ChevronLeftIcon } from "@/components/icons";
import type { StringKey } from "@/lib/i18n";
import { PracticeFlashcards } from "./PracticeFlashcards";
import { PracticeGunita } from "./PracticeGunita";
import { PracticeMatch } from "./PracticeMatch";
import { PracticeWordGame } from "./PracticeWordGame";

type Mode = "match" | "gunita" | "flashcards" | "wordgame";

const MODES: { mode: Mode; titleKey: StringKey; subKey: StringKey }[] = [
  { mode: "match", titleKey: "practiceModeMatch", subKey: "practiceModeMatchSub" },
  { mode: "gunita", titleKey: "practiceModeGunita", subKey: "practiceModeGunitaSub" },
  { mode: "flashcards", titleKey: "practiceModeFlashcards", subKey: "practiceModeFlashcardsSub" },
  { mode: "wordgame", titleKey: "practiceModeWordGame", subKey: "practiceModeWordGameSub" },
];

/**
 * Top of the /learn/practice route: a menu of practice modes, or the running mode with a way
 * back. Deliberately not a "daily" surface — no streaks, no changing-per-day content, nothing
 * promoted from the home page (see AGENTS.md non-goals). The user comes here when they want to.
 */
export function PracticeHub() {
  const t = useT();
  const [mode, setMode] = useState<Mode | null>(null);

  if (mode === null) {
    return (
      <ul className="flex flex-col gap-3">
        {MODES.map((entry) => (
          <li key={entry.mode}>
            <button
              type="button"
              onClick={() => setMode(entry.mode)}
              className="group flex w-full items-center justify-between gap-4 rounded-lg border border-line bg-paper p-4 min-h-14 text-left transition-colors hover:border-accent active:border-accent active:bg-paper-edge"
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
      {mode === "match" && <PracticeMatch />}
      {mode === "gunita" && <PracticeGunita />}
      {mode === "flashcards" && <PracticeFlashcards />}
      {mode === "wordgame" && <PracticeWordGame />}
    </div>
  );
}
