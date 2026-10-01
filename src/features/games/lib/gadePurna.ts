/**
 * ಗಾದೆ ಪೂರ್ಣ · Finish the proverb (#135): show the first half of the day's ಗಾದೆ, rebuild the second
 * half from shuffled word tiles with one decoy mixed in, three tries. Everything here is a pure
 * function of the proverb list and the local date, so everyone gets the same puzzle that day.
 * The day's saved tries live in gadeState.ts.
 */
import { assertShareable } from "@/features/share/lib/shareCard";
import { mulberry32, shuffledIndices } from "@/lib/prng";
import type { Proverb } from "@/lib/types";
import { MAX_TRIES, type GadeState } from "./gadeState";
import { dailyPoolIndex, daysSinceEpoch } from "./wordGameDay";

const MIN_WORDS = 4;
const MAX_WORDS = 10;
const MAX_TILES = 6;
/** Fixed so the pool order (and so each day's proverb) never changes between builds of the same data. */
const POOL_SEED = 135;

export interface GadePuzzle {
  proverb: Proverb;
  /** Shown as the clue, punctuation and all. */
  first: string;
  /** The words to rebuild, in order, edge punctuation stripped. */
  answer: string[];
}

/** Leading/trailing punctuation off a tile word ("ತೂರು." → "ತೂರು"). */
const bare = (word: string) => word.replace(/^[“"'‘(]+|[.,!?;:।”"'’)]+$/gu, "");

/**
 * Splits a proverb into clue + answer, or null when it makes a poor puzzle: too short or long,
 * bracketed asides or digits, a damaged encoding, or too few/many words left to arrange. Splits
 * after a comma when that leaves two or more words each side, else at the middle word.
 */
export function splitProverb(proverb: Proverb): GadePuzzle | null {
  const text = proverb.text.normalize("NFC").trim();
  if (/[()[\]0-9೦-೯/]/u.test(text)) return null;
  try {
    assertShareable(text);
  } catch {
    return null;
  }
  const words = text.split(/\s+/);
  if (words.length < MIN_WORDS || words.length > MAX_WORDS) return null;
  const comma = words.findIndex((w, i) => w.endsWith(",") && i >= 1 && i <= words.length - 3);
  const cut = comma >= 0 ? comma + 1 : Math.floor(words.length / 2);
  const answer = words.slice(cut).map(bare);
  if (answer.length < 2 || answer.length > MAX_TILES || answer.some((w) => w === "")) return null;
  return { proverb, first: words.slice(0, cut).join(" "), answer };
}

/** Every playable proverb, in a fixed shuffled order (neighbouring days get unrelated sayings). */
export function gadePool(proverbs: readonly Proverb[]): GadePuzzle[] {
  const playable = proverbs.map(splitProverb).filter((p): p is GadePuzzle => p !== null);
  return shuffledIndices(playable.length, POOL_SEED).map((i) => playable[i]!);
}

export function todaysGade(pool: readonly GadePuzzle[], date: Date): GadePuzzle | null {
  return pool[dailyPoolIndex(date, pool.length)] ?? null;
}

/** The answer words plus one decoy from another proverb, shuffled — the same for everyone that day. */
export function gadeTiles(puzzle: GadePuzzle, pool: readonly GadePuzzle[], date: Date): string[] {
  const rand = mulberry32(daysSinceEpoch(date) * 7919 + POOL_SEED);
  const decoys = pool.flatMap((p) => (p === puzzle ? [] : p.answer)).filter((w) => !puzzle.answer.includes(w));
  const decoy = decoys[Math.floor(rand() * decoys.length)];
  const tiles = decoy ? [...puzzle.answer, decoy] : [...puzzle.answer];
  return shuffledIndices(tiles.length, daysSinceEpoch(date) + POOL_SEED).map((i) => tiles[i]!);
}

export type GadeOutcome = "playing" | "won" | "lost";

export function gadeOutcome(state: GadeState, answer: readonly string[]): GadeOutcome {
  if (state.tries.some((t) => t.join(" ") === answer.join(" "))) return "won";
  return state.tries.length >= MAX_TRIES ? "lost" : "playing";
}

/** Which slots of a try hold the right word — the hint shown after a miss. */
export function rightPlaces(attempt: readonly string[], answer: readonly string[]): boolean[] {
  return answer.map((word, i) => attempt[i] === word);
}

/**
 * The blanks to start the next try with: words a missed try already had in the right place stay
 * (as indices into `tiles`), the rest are empty. Repeated words each claim their own tile.
 */
export function keptSlots(attempt: readonly string[], answer: readonly string[], tiles: readonly string[]): (number | null)[] {
  const taken = new Set<number>();
  return rightPlaces(attempt, answer).map((right, i) => {
    if (!right) return null;
    const tile = tiles.findIndex((w, j) => w === answer[i] && !taken.has(j));
    if (tile < 0) return null;
    taken.add(tile);
    return tile;
  });
}
