import type { Locale, PadabandhaSet } from "@/lib/types";
import { dailyPoolIndex } from "@/features/games/lib/wordGameDay";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import type { PadabandhaPuzzle } from "../types";

/** Same pool `PadabandhaGame` renders: the hand-written puzzle first, then the generated set for `locale`. */
export function padabandhaPool(set: PadabandhaSet | null | undefined, locale: Locale): readonly PadabandhaPuzzle[] {
  return [BEGINNER_PADABANDHA, ...(set?.[locale] ?? [])];
}

/** Deterministic id of the puzzle `PadabandhaGame` shows for `locale` on `date`. */
export function dailyPadabandhaId(set: PadabandhaSet | null | undefined, locale: Locale, date: Date): string {
  const pool = padabandhaPool(set, locale);
  const index = dailyPoolIndex(date, pool.length);
  return pool[index]?.id ?? BEGINNER_PADABANDHA.id;
}

/**
 * Fetches the generated set and resolves today's puzzle id for `locale`. Used off the game
 * screen (continue-on-device build/apply) where the pool isn't already in memory; falls back to
 * the always-available beginner puzzle if the fetch fails.
 */
export async function fetchTodaysPadabandhaId(locale: Locale, now: Date = new Date()): Promise<string> {
  try {
    const res = await fetch("/data/dict/padabandha.json");
    const set = res.ok ? ((await res.json()) as PadabandhaSet) : null;
    return dailyPadabandhaId(set, locale, now);
  } catch {
    return BEGINNER_PADABANDHA.id;
  }
}
