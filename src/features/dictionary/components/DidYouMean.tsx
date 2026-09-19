"use client";

import { useT } from "@/components/providers/AppProviders";

interface DidYouMeanProps {
  words: string[];
  onPick: (word: string) => void;
}

/** Clickable "did you mean" headwords shown when dictionary search returns nothing. */
export function DidYouMean({ words, onPick }: DidYouMeanProps) {
  const t = useT();
  if (words.length === 0) return null;

  return (
    <section className="flex flex-col gap-3" aria-label={t("didYouMean")}>
      <h2 className="kicker text-accent-strong">{t("didYouMean")}</h2>
      <ul className="flex flex-wrap gap-2">
        {words.map((word) => (
          <li key={word}>
            <button
              type="button"
              onClick={() => onPick(word)}
              lang="kn"
              className="inline-flex items-center h-11 px-4 rounded-full border border-line-strong bg-elevated font-serif text-base text-ink hover:bg-elevated active:bg-paper-edge"
            >
              {word}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
