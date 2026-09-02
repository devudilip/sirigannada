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
    <section className="flex flex-col items-center gap-3" aria-label={t("didYouMean")}>
      <h2 className="text-base font-medium text-secondary">{t("didYouMean")}</h2>
      <ul className="flex flex-wrap justify-center gap-2">
        {words.map((word) => (
          <li key={word}>
            <button
              type="button"
              onClick={() => onPick(word)}
              lang="kn"
              className="h-11 px-4 rounded-full border border-line bg-paper text-base text-ink hover:border-accent hover:text-accent transition-colors"
            >
              {word}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
