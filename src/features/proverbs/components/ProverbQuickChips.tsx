"use client";

import { useT } from "@/components/providers/AppProviders";

/** Proverb content, not UI chrome — common words that surface a rich set of sayings. */
const QUICK_SEARCHES = ["ಮನೆ", "ಮಳೆ", "ಅಡುಗೆ", "ಊರು"];

/** Row of square, ink-bordered quick-search chips; the active one fills. */
export function ProverbQuickChips({ active, onPick }: { active: string; onPick: (word: string) => void }) {
  const t = useT();
  return (
    <ul className="flex flex-wrap gap-2" aria-label={t("proverbQuickSearches")}>
      {QUICK_SEARCHES.map((word) => {
        const pressed = active.trim() === word;
        return (
          <li key={word}>
            <button
              type="button"
              onClick={() => onPick(pressed ? "" : word)}
              aria-pressed={pressed}
              lang="kn"
              className={`inline-flex items-center h-11 px-3 border border-ink font-serif text-base transition-colors ${
                pressed ? "bg-ink text-surface" : "text-ink hover:bg-elevated active:bg-paper-edge"
              }`}
            >
              {word}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
