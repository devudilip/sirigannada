import { dailyPoolIndex } from "@/features/games/lib/wordGameDay";
import { shuffledIndices } from "@/lib/prng";
import type { Proverb } from "../types";

/** Fixed seed so the daily order is the same on every device and after every deploy. */
const DAILY_SEED = 0x67616465; // "gade"

/**
 * Index of today's proverb (ಇಂದಿನ ಗಾದೆ). Deterministic: the same local calendar date gives the
 * same proverb to everyone, offline, with no server. The pool is walked in a seeded shuffle so
 * consecutive days do not read as neighbours in the alphabetical file; it cycles after
 * `total` days.
 */
export function dailyProverbIndex(date: Date, total: number): number {
  if (total <= 0) return 0;
  const order = shuffledIndices(total, DAILY_SEED);
  return order[dailyPoolIndex(date, total)] ?? 0;
}

export function dailyProverb(date: Date, proverbs: readonly Proverb[]): Proverb | null {
  if (proverbs.length === 0) return null;
  return proverbs[dailyProverbIndex(date, proverbs.length)] ?? null;
}
