"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { dailyPoolIndex } from "@/features/games/lib/wordGameDay";
import type { PadabandhaSet } from "@/lib/types";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import type { PadabandhaPuzzle } from "../types";
import { PadabandhaBoard } from "./PadabandhaBoard";

/**
 * Picks today's crossword (G-01): the hand-written puzzle plus the generated set from
 * `public/data/dict/padabandha.json`, chosen per UI locale so Kannada never shows English clues.
 * One puzzle per local calendar day, the same for everyone; the set rotates so tomorrow is new.
 */
export function PadabandhaGame() {
  const t = useT();
  const { locale } = useApp();
  const [set, setSet] = useState<PadabandhaSet | null | undefined>(undefined);

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

  if (set === undefined) return <Skeleton className="h-64 w-full" />;
  const puzzle = puzzles[dailyIndex] ?? BEGINNER_PADABANDHA;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-semibold text-ink">{t("gameDailyLabel")}</p>
      {set === null && <p className="text-sm text-muted">{t("padabandhaLoadError")}</p>}
      <h2 lang="kn" className="font-serif text-xl text-ink">
        {puzzle.title.kn}
      </h2>
      <PadabandhaBoard key={puzzle.id} puzzle={puzzle} />
    </div>
  );
}
