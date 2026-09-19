"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { ARCHAIC, SCHOOL_CONSONANTS, VOWELS } from "@/lib/kannadaAlphabet";
import { loadManifest } from "../lib/data";

/** Varnamale order: 13 vowels, 34 consonants, 2 archaic. */
const ALPHABET: readonly string[] = [...VOWELS, ...SCHOOL_CONSONANTS, ...ARCHAIC];

/**
 * Tap-a-letter index for the dictionary empty state. Sums the manifest's per-akshara shard
 * counts down to the first letter, then seeds a prefix search when a letter is picked.
 */
export function DictionaryLetterIndex({ onPick }: { onPick: (letter: string) => void }) {
  const t = useT();
  const [counts, setCounts] = useState<Map<string, number> | null>(null);

  useEffect(() => {
    let alive = true;
    loadManifest().then((manifest) => {
      if (!alive || !manifest) return;
      const byLetter = new Map<string, number>();
      for (const shard of manifest.shards) {
        const first = [...shard.akshara][0] ?? "";
        byLetter.set(first, (byLetter.get(first) ?? 0) + shard.count);
      }
      setCounts(byLetter);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!counts) return null;

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-ink">{t("dictBrowseByLetter")}</h2>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("dictBrowseByLetter")}>
        {ALPHABET.map((letter) => {
          const n = counts.get(letter) ?? 0;
          return (
            <button
              key={letter}
              type="button"
              lang="kn"
              disabled={n === 0}
              onClick={() => onPick(letter)}
              title={t("dictResultCount", { n })}
              className="min-h-11 min-w-11 rounded-md border border-line bg-elevated px-2 font-serif text-lg text-ink transition-colors duration-150 enabled:hover:border-line-strong disabled:opacity-30"
            >
              {letter}
            </button>
          );
        })}
      </div>
    </section>
  );
}
