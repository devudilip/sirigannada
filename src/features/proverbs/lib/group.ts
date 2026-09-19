import { isKannadaLetter, splitAksharas } from "@/lib/kannada";
import type { Proverb } from "../types";

/** Rows whose first akshara is not a Kannada letter (bracketed notes, Latin) sit under this key. */
export const OTHER_GROUP = "#";

export interface ProverbGroup {
  /** Base consonant/vowel of the first akshara: ಮನೆ and ಮಾತು both sit under ಮ. */
  letter: string;
  /** Visible rows in this group, in sorted order. */
  items: Proverb[];
  /** Rows in the full (unwindowed) match list that share this letter. */
  total: number;
}

export interface LetterCount {
  letter: string;
  count: number;
}

/**
 * Base letter a proverb sorts under: the first Kannada letter of its first akshara, with any
 * vowel sign, anusvara, or conjunct stripped. Leading punctuation and spaces are skipped so
 * "(ಅವರು) ಚಾಪೆ…" still lands under ಅ.
 */
export function groupLetter(text: string): string {
  for (const akshara of splitAksharas(text)) {
    const first = [...akshara][0] ?? "";
    if (isKannadaLetter(first)) return first;
    if (/[ಀ-೿]/.test(first)) return OTHER_GROUP;
  }
  return OTHER_GROUP;
}

/** Kannada letters sort by code point (which follows the alphabet); the other bucket goes last. */
function letterRank(letter: string): number {
  return letter === OTHER_GROUP ? Number.MAX_SAFE_INTEGER : letter.codePointAt(0) ?? 0;
}

/**
 * Stable sort by first letter so the browse view reads as one alphabetical index. Rows within a
 * letter keep source order; the source file itself is not reliably sorted, which is why the
 * earlier "group the visible window" approach showed ಅ again after ಕ.
 */
export function sortByLetter(proverbs: readonly Proverb[]): Proverb[] {
  return proverbs
    .map((p, index) => ({ p, index, rank: letterRank(groupLetter(p.text)) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ p }) => p);
}

/** Letters present in the corpus with counts, in alphabetical order — feeds the index rail. */
export function letterCounts(proverbs: readonly Proverb[]): LetterCount[] {
  const counts = new Map<string, number>();
  for (const p of proverbs) {
    const letter = groupLetter(p.text);
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => letterRank(a.letter) - letterRank(b.letter));
}

/** Rows that sort under `letter`. */
export function filterByLetter(proverbs: readonly Proverb[], letter: string): Proverb[] {
  return proverbs.filter((p) => groupLetter(p.text) === letter);
}

/**
 * Groups the visible window by first letter, in order of first appearance. Pass a window taken
 * from `sortByLetter(all)` so every letter appears once. `total` counts every match under that
 * letter, not only the visible ones, so a header can say "312 · showing 40".
 */
export function groupProverbs(visible: readonly Proverb[], all: readonly Proverb[]): ProverbGroup[] {
  const totals = new Map(letterCounts(all).map(({ letter, count }) => [letter, count]));
  const groups: ProverbGroup[] = [];
  const byLetter = new Map<string, ProverbGroup>();
  for (const p of visible) {
    const letter = groupLetter(p.text);
    let group = byLetter.get(letter);
    if (!group) {
      group = { letter, items: [], total: totals.get(letter) ?? 0 };
      byLetter.set(letter, group);
      groups.push(group);
    }
    group.items.push(p);
  }
  return groups;
}
