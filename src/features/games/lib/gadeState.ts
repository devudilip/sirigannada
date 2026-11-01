/**
 * The day's ಗಾದೆ ಪೂರ್ಣ tries on this device. Kept apart from gadePurna.ts so the continue feature
 * (on many pages) can read and restore them without pulling in the puzzle and share-card code.
 */
import { readStorage, writeStorage } from "@/lib/storage";

export const MAX_TRIES = 3;

export interface GadeState {
  date: string;
  /** Each checked try: the words placed, in order. */
  tries: string[][];
}

const storageKey = (date: string) => `gade:${date}`;

export function loadGadeState(date: string): GadeState {
  const stored = readStorage<Partial<GadeState> | null>(storageKey(date), null);
  const tries = Array.isArray(stored?.tries) ? stored.tries.filter((t): t is string[] => Array.isArray(t)) : [];
  return { date, tries: stored?.date === date ? tries.slice(0, MAX_TRIES) : [] };
}

export function saveGadeState(state: GadeState): void {
  writeStorage(storageKey(state.date), state);
}
