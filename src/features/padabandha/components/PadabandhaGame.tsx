"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { RoundHeader } from "@/features/games/components/RoundHeader";
import { loadRounds, nextRound, saveRounds } from "@/features/games/lib/rounds";
import { dailyPoolIndex } from "@/features/games/lib/wordGameDay";
import type { PadabandhaSet } from "@/lib/types";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import type { PadabandhaPuzzle } from "../types";
import { PadabandhaBoard } from "./PadabandhaBoard";

const GAME = "padabandha";

/**
 * Picks which crossword to show (G-01): the hand-written puzzle plus the generated set from
 * `public/data/dict/padabandha.json`, chosen per UI locale so Kannada never shows English clues.
 * Today's puzzle is a pure function of the local date; extra rounds walk the rest of the set in a
 * per-device order without repeats.
 */
export function PadabandhaGame() {
  const t = useT();
  const { locale } = useApp();
  const [set, setSet] = useState<PadabandhaSet | null | undefined>(undefined);
  const [selection, setSelection] = useState<{ round: number; index: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/dict/padabandha.json")
      .then((res) => (res.ok ? (res.json() as Promise<PadabandhaSet>) : null))
      .then((data) => {
        if (!cancelled) setSet(data);
      })
      .catch(() => {
        if (!cancelled) setSet(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Kannada readers only ever see grids whose clues were written in Kannada (see PadabandhaSet).
  const puzzles = useMemo<readonly PadabandhaPuzzle[]>(() => [BEGINNER_PADABANDHA, ...(set?.[locale] ?? [])], [set, locale]);
  const today = useMemo(() => new Date(), []);
  const dailyIndex = useMemo(() => dailyPoolIndex(today, puzzles.length), [today, puzzles.length]);

  useEffect(() => {
    if (set !== undefined) setSelection({ round: 0, index: dailyIndex });
  }, [set, dailyIndex, locale]);

  const another = () => {
    if (!selection) return;
    const game = `${GAME}:${locale}`;
    const picked = nextRound(loadRounds(game, puzzles.length), puzzles.length, [dailyIndex]);
    saveRounds(game, picked.state);
    setSelection({ round: selection.round + 1, index: picked.index });
  };

  if (set === undefined || !selection) return <Skeleton className="h-64 w-full" />;
  const puzzle = puzzles[selection.index] ?? BEGINNER_PADABANDHA;

  return (
    <div className="flex flex-col gap-4">
      <RoundHeader round={selection.round} onAnother={another} onBackToDaily={() => setSelection({ round: 0, index: dailyIndex })} />
      {set === null && <p className="text-sm text-muted">{t("padabandhaLoadError")}</p>}
      <h2 lang="kn" className="font-serif text-xl text-ink">
        {puzzle.title.kn}
      </h2>
      <PadabandhaBoard key={puzzle.id} puzzle={puzzle} />
    </div>
  );
}
