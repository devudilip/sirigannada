"use client";

import { useT } from "@/components/providers/AppProviders";
import { OTHER_GROUP, type LetterCount } from "../lib/group";

/**
 * Vertical letter index at the right edge (design 1g). Tapping a letter narrows the list to
 * proverbs that start with it; tapping the active letter, or ಎಲ್ಲ at the top, shows every letter.
 */
export function ProverbLetterRail({
  letters,
  active,
  onPick,
}: {
  letters: readonly LetterCount[];
  active: string | null;
  onPick: (letter: string | null) => void;
}) {
  const t = useT();
  const item = "flex h-6 w-7 md:h-7 md:w-10 items-center justify-center text-xs md:text-sm font-semibold leading-none";
  return (
    <nav aria-label={t("proverbLetterIndex")} className="sticky top-2 max-h-[calc(100dvh-7rem)] self-start overflow-y-auto [scrollbar-width:none] md:top-20">
      <ul className="flex flex-col items-center">
        <li>
          <button
            type="button"
            onClick={() => onPick(null)}
            aria-pressed={active === null}
            className={`${item} ${active === null ? "text-accent-strong" : "text-muted hover:text-ink"}`}
            lang="kn"
          >
            {t("proverbAllLetters")}
          </button>
        </li>
        {letters.map(({ letter, count }) => (
          <li key={letter}>
            <button
              type="button"
              onClick={() => onPick(active === letter ? null : letter)}
              aria-pressed={active === letter}
              aria-label={t("proverbLetterCount", { letter, count })}
              className={`${item} ${active === letter ? "text-accent-strong" : "text-muted hover:text-ink"}`}
              lang="kn"
            >
              {letter === OTHER_GROUP ? "·" : letter}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
