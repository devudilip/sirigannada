"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useT } from "@/components/providers/AppProviders";
import { hasKannada } from "@/lib/kannada";
import { SavedWordRow } from "./SavedWordRow";

/** Dictionary content, not UI chrome — shown to first-time visitors as tap-to-try searches. */
const EXAMPLE_SEARCHES = ["ಮನೆ", "ಶಾಲೆ", "ಹೂವು", "house"];

const chipClass = "inline-flex items-center h-11 px-4 border border-ink text-base text-ink hover:bg-elevated active:bg-paper-edge";

interface SearchEmptyStateProps {
  history: string[];
  favourites: string[];
  onPick: (word: string) => void;
  onClearHistory: () => void;
  onToggleStar: (word: string) => void;
}

export function SearchEmptyState({
  history,
  favourites,
  onPick,
  onClearHistory,
  onToggleStar,
}: SearchEmptyStateProps) {
  const t = useT();

  if (history.length === 0 && favourites.length === 0) {
    return (
      <section>
        <SectionHeading k="trySearches" />
        <ul className="flex flex-wrap gap-2">
          {EXAMPLE_SEARCHES.map((word) => (
            <li key={word}>
              <button type="button" onClick={() => onPick(word)} lang={hasKannada(word) ? "kn" : "en"} className={chipClass}>
                {word}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {favourites.length > 0 && (
        <section>
          <SectionHeading k="favourites" detail={String(favourites.length)} />
          <ul className="flex flex-col">
            {favourites.map((word) => (
              <li key={word} className="rule-row">
                <SavedWordRow word={word} onPick={onPick} starred onToggleStar={onToggleStar} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <div className="rule-section flex items-center justify-between gap-4 pt-3 mb-3">
            <h2 className="kicker text-accent-strong">{t("recentSearches")}</h2>
            <button
              type="button"
              onClick={onClearHistory}
              aria-label={t("clearHistory")}
              className="inline-flex items-center min-h-11 px-2 -mr-2 text-sm font-semibold text-accent-strong hover:underline"
            >
              {t("dictClearHistory")}
            </button>
          </div>
          <ul className="flex flex-col">
            {history.map((word) => (
              <li key={word} className="rule-row">
                <SavedWordRow word={word} onPick={onPick} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
