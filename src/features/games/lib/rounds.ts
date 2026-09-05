/**
 * Per-device "another round" ordering shared by the games (G-01, G-02). Every game keeps a
 * *daily* puzzle that is the same for everyone; extra rounds walk the rest of the pool in a
 * shuffled order that is fixed for this device (seeded once, stored in localStorage) so a player
 * never sees a repeat until the pool is exhausted. Then a fresh seed starts a new pass.
 * Pure functions here; `loadRounds`/`saveRounds` are the only storage touch points.
 */
import { shuffledIndices } from "@/lib/prng";
import { readStorage, writeStorage } from "@/lib/storage";

export interface RoundsState {
  seed: number;
  /** Position in the shuffled order; the next call starts looking here. */
  cursor: number;
  /** Pool size the order was built for; a changed pool restarts the pass. */
  total: number;
}

export function initRounds(total: number, seed = freshSeed()): RoundsState {
  return { seed, cursor: 0, total };
}

export function freshSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff) + 1;
}

/**
 * Advances to the next pool index, skipping `exclude` (typically today's daily index). Returns
 * the new state and the chosen index. When the pass is exhausted, reseeds and starts over.
 */
export function nextRound(state: RoundsState, total: number, exclude: readonly number[] = []): { state: RoundsState; index: number } {
  if (total <= 0) return { state, index: 0 };
  let current = state.total === total ? state : initRounds(total, state.seed + 1);
  for (let pass = 0; pass < 2; pass += 1) {
    const order = shuffledIndices(total, current.seed);
    for (let i = current.cursor; i < order.length; i += 1) {
      const index = order[i]!;
      if (exclude.includes(index) && total > exclude.length) continue;
      return { state: { ...current, cursor: i + 1 }, index };
    }
    current = initRounds(total, current.seed + 1);
  }
  return { state: current, index: 0 };
}

function storageKey(game: string): string {
  return `games:${game}:rounds`;
}

export function loadRounds(game: string, total: number): RoundsState {
  const stored = readStorage<RoundsState | null>(storageKey(game), null);
  if (stored && typeof stored.seed === "number" && typeof stored.cursor === "number") return stored;
  return initRounds(total);
}

export function saveRounds(game: string, state: RoundsState): void {
  writeStorage(storageKey(game), state);
}
