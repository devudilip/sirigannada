import type { Proverb } from "../types";

export const INITIAL_PROVERB_COUNT = 40;
export const PROVERB_BATCH_SIZE = 40;

export function getVisibleProverbs(
  matches: readonly Proverb[],
  visibleCount: number,
): Proverb[] {
  return matches.slice(0, Math.max(0, visibleCount));
}

export function getNextVisibleCount(current: number, total: number): number {
  return Math.min(total, current + PROVERB_BATCH_SIZE);
}
