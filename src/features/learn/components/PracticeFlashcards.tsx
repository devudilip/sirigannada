"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { useCollections } from "@/features/collections/lib/useCollections";
import { FAVOURITES_COLLECTION_ID, type CollectionItem } from "@/features/collections/types";
import { loadShardForWord } from "@/features/dictionary/lib/data";
import { firstSense } from "../lib/practiceMatch";
import { buildFlashcardDeck } from "../lib/practiceFlashcards";

function isWordItem(item: CollectionItem): item is Extract<CollectionItem, { kind: "word" }> {
  return item.kind === "word";
}

/**
 * Flip-card review of the user's ★ favourite words. Reads the implicit Favourites collection
 * (see src/features/collections) — never requires favourites to exist for the other two modes.
 */
export function PracticeFlashcards() {
  const t = useT();
  const { data, loaded } = useCollections();
  const [seed] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [meaning, setMeaning] = useState<string | null>(null);

  const words = useMemo(() => {
    const favourites = data.collections.find((c) => c.id === FAVOURITES_COLLECTION_ID);
    return favourites?.items.filter(isWordItem).map((it) => it.word) ?? [];
  }, [data]);
  const deck = useMemo(() => buildFlashcardDeck(words, seed), [words, seed]);

  const word = deck[index];

  useEffect(() => {
    setFlipped(false);
    setMeaning(null);
    if (!word) return;
    let cancelled = false;
    loadShardForWord(word).then((shard) => {
      if (cancelled) return;
      const entry = shard?.entries.find((e) => e.word === word) ?? null;
      setMeaning(entry ? firstSense(entry) : null);
    });
    return () => {
      cancelled = true;
    };
  }, [word]);

  if (!loaded) return null;
  if (deck.length === 0) {
    return <p className="text-base text-secondary">{t("practiceFlashcardsEmpty")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-secondary">{t("practiceFlashcardsProgress", { n: index + 1, total: deck.length })}</p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-line bg-elevated p-6 text-center transition-colors hover:border-line-strong"
      >
        {flipped ? (
          <span lang="en" className="text-lg text-ink">
            {meaning ?? t("practiceFlashcardsNoMeaning")}
          </span>
        ) : (
          <span lang="kn" className="font-serif text-3xl font-semibold text-ink">
            {word}
          </span>
        )}
        <span className="text-xs text-muted">{t("practiceFlashcardsFlip")}</span>
      </button>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          {t("prevPage")}
        </Button>
        <Button
          disabled={index === deck.length - 1}
          onClick={() => setIndex((i) => Math.min(deck.length - 1, i + 1))}
        >
          {t("nextPage")}
        </Button>
      </div>
    </div>
  );
}
