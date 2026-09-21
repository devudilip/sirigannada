"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { ARCHAIC, SCHOOL_CONSONANTS, VOWELS } from "@/lib/kannadaAlphabet";
import type { DictManifest } from "@/lib/types";
import { loadManifest } from "../lib/data";

/** Varnamale order: 13 vowels, 34 consonants, 2 archaic. */
const ALPHABET: readonly string[] = [...VOWELS, ...SCHOOL_CONSONANTS, ...ARCHAIC];

const BUTTON_CLASS =
  "min-h-11 min-w-11 rounded-md border border-line bg-elevated px-2 font-serif text-lg text-ink transition-colors duration-150 enabled:hover:border-line-strong disabled:opacity-30";

/**
 * Tap-a-letter index for the dictionary empty state, grouped by manifest shard so a letter that
 * Q-08 split into many sub-shards (ಕ: 46 files, ~21k words) expands to a second row of
 * second-akshara chips instead of seeding a bare one-character query — that would otherwise force
 * `search()` to load every one of those sub-shards just to show its first 60 results (#76/#84).
 * Bare single-character headwords (the rare no-second-akshara sub-shard some split letters have)
 * aren't reachable from here; they're still found via free-text search.
 */
export function DictionaryLetterIndex({ onPick }: { onPick: (query: string) => void }) {
  const t = useT();
  const [manifest, setManifest] = useState<DictManifest | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadManifest().then((m) => {
      if (alive) setManifest(m);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!manifest) return null;

  const byLetter = new Map<string, { akshara: string; count: number }[]>();
  for (const shard of manifest.shards) {
    const first = [...shard.akshara][0] ?? "";
    byLetter.set(first, [...(byLetter.get(first) ?? []), shard]);
  }
  const label = (n: number) => (n === 1 ? t("dictResultCountOne") : t("dictResultCount", { n }));
  const subShards = (expanded ? byLetter.get(expanded) : undefined)?.filter((s) => [...s.akshara][1] !== "_") ?? [];

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-ink">{t("dictBrowseByLetter")}</h2>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("dictBrowseByLetter")}>
        {ALPHABET.map((letter) => {
          const refs = byLetter.get(letter) ?? [];
          const n = refs.reduce((sum, r) => sum + r.count, 0);
          const split = refs.length > 1;
          return (
            <button
              key={letter}
              type="button"
              lang="kn"
              disabled={n === 0}
              onClick={() => (split ? setExpanded(letter) : onPick(letter))}
              title={label(n)}
              aria-expanded={split ? expanded === letter : undefined}
              className={BUTTON_CLASS}
            >
              {letter}
            </button>
          );
        })}
      </div>
      {subShards.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={expanded ?? ""}>
          {subShards.map((s) => (
            <button
              key={s.akshara}
              type="button"
              lang="kn"
              onClick={() => onPick(s.akshara)}
              title={label(s.count)}
              className={BUTTON_CLASS}
            >
              {s.akshara}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
