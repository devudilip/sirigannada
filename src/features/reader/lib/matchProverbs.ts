import type { Proverb } from "@/features/proverbs/types";
import { normaliseBookSearchText } from "./bookSearch";

const MAX_MATCHES = 5;

/**
 * Finds proverbs containing `word` — a plain substring scan across the (small, already-loaded)
 * proverb list, reusing the same Kannada-safe, case/diacritic-insensitive normalisation as the
 * in-book search (B-04). Capped at `MAX_MATCHES`: this is a "does this word show up in a
 * proverb" glance, not a ranked search.
 */
export function matchProverbs(proverbs: readonly Proverb[], word: string): Proverb[] {
  const needle = normaliseBookSearchText(word);
  if (!needle) return [];
  const out: Proverb[] = [];
  for (const p of proverbs) {
    if (normaliseBookSearchText(p.text).includes(needle)) {
      out.push(p);
      if (out.length >= MAX_MATCHES) break;
    }
  }
  return out;
}
