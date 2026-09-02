"use client";

import { useT } from "@/components/providers/AppProviders";
import { SavedWordRow } from "./SavedWordRow";

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
  if (history.length === 0 && favourites.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {favourites.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-ink mb-2">{t("favourites")}</h2>
          <ul className="flex flex-col">
            {favourites.map((word) => (
              <li key={word} className="border-b border-line last:border-b-0">
                <SavedWordRow word={word} onPick={onPick} starred onToggleStar={onToggleStar} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-3 mb-2">
            <h2 className="text-xl font-semibold text-ink">{t("recentSearches")}</h2>
            <button
              type="button"
              onClick={onClearHistory}
              className="h-11 px-3 text-sm font-medium text-secondary hover:text-ink rounded-md hover:bg-paper"
            >
              {t("clearHistory")}
            </button>
          </div>
          <ul className="flex flex-col">
            {history.map((word) => (
              <li key={word} className="border-b border-line last:border-b-0">
                <SavedWordRow word={word} onPick={onPick} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
