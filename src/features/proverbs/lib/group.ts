import { isKannadaLetter, splitAksharas } from "@/lib/kannada";
import type { Proverb } from "../types";

/** Rows whose first akshara is not a Kannada letter (bracketed notes, Latin) sit under this key. */
export const OTHER_GROUP = "#";

export interface ProverbGroup {
  /** Base consonant/vowel of the first akshara: ಮನೆ and ಮಾತು both sit under ಮ. */
  letter: string;
  /** Visible rows in this group, in source order. */
  items: Proverb[];
  /** Rows in the full (unwindowed) match list that share this letter. */
  total: number;
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

/**
 * Groups the visible window by first letter, in order of first appearance (the source file is
 * alphabetical, so this reads as an index). `total` counts every match under that letter, not
 * only the visible ones, so a header can say "312 · showing 40".
 */
export function groupProverbs(visible: readonly Proverb[], all: readonly Proverb[]): ProverbGroup[] {
  const totals = new Map<string, number>();
  for (const p of all) {
    const letter = groupLetter(p.text);
    totals.set(letter, (totals.get(letter) ?? 0) + 1);
  }
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
