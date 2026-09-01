import type { DictEntry, ReverseShard } from "../../src/lib/types";
import { tokenise, tokenShard } from "./tokenise";

/** One reverse-index hit: [entry id, Kannada headword]. */
export type ReverseHit = ReverseShard["index"][string][number];

/** Cap per token so that common words ("water") do not bloat a shard. */
export const MAX_HITS_PER_TOKEN = 200;

interface ScoredHit {
  id: number;
  word: string;
  /** Lower is more relevant: the token appears early in a short definition. */
  score: number;
}

export type ReverseIndex = Map<string, Map<string, ScoredHit[]>>;

/** Definitions list glosses separated by ; , : and parentheses — score within each gloss. */
const GLOSS_SPLIT = /[;,:()]/;

/**
 * Relevance of each token for one entry. A gloss like "a house" scores near 0; a long gloss
 * that mentions "house" in passing scores high. Appearing in several glosses earns a bonus.
 */
function scoreTokens(entry: DictEntry): Map<string, number> {
  const scores = new Map<string, number>();
  for (const d of entry.defs) {
    for (const gloss of d.text.split(GLOSS_SPLIT)) {
      const tokens = tokenise(gloss);
      tokens.forEach((t, position) => {
        const s = position + tokens.length / 4;
        const prev = scores.get(t);
        scores.set(t, prev === undefined ? s : Math.min(prev, s) - 0.5);
      });
    }
  }
  return scores;
}

/**
 * Build letter → (token → scored hits) from every English definition. Each entry contributes
 * at most one hit per token. Hits are not capped here; `toReverseShard` keeps the best ones.
 */
export function buildReverseIndex(entries: DictEntry[]): ReverseIndex {
  const byLetter: ReverseIndex = new Map();
  for (const e of entries) {
    for (const [t, score] of scoreTokens(e)) {
      const letter = tokenShard(t);
      let index = byLetter.get(letter);
      if (!index) byLetter.set(letter, (index = new Map()));
      const hits = index.get(t);
      const hit: ScoredHit = { id: e.id, word: e.word, score };
      if (!hits) index.set(t, [hit]);
      else hits.push(hit);
    }
  }
  return byLetter;
}

/** Serialise one letter's index: tokens alphabetical, hits by relevance, capped per token. */
export function toReverseShard(letter: string, index: Map<string, ScoredHit[]>): ReverseShard {
  const sorted = [...index.entries()].sort(([a], [b]) => a.localeCompare(b, "en"));
  const out: ReverseShard["index"] = {};
  for (const [token, hits] of sorted) {
    hits.sort((a, b) => a.score - b.score || a.id - b.id);
    out[token] = hits.slice(0, MAX_HITS_PER_TOKEN).map((h): ReverseHit => [h.id, h.word]);
  }
  return { letter, index: out };
}
