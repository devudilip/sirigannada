import type { DictEntry } from "@/lib/types";
import { makeRng, pickRandom, seededShuffle } from "./practiceRandom";

export interface MatchQuestion {
  word: string;
  choices: string[];
  correctIndex: number;
}

const CHOICE_COUNT = 4;
/** defs[].text sometimes trails off into example phrases after a semicolon; keep just the sense. */
const MAX_MEANING_LENGTH = 140;

/** First, short sense of an entry's primary definition — good enough for a quiz choice. */
export function firstSense(entry: DictEntry): string {
  const raw = entry.defs[0]?.text ?? "";
  const sense = raw.split(";")[0]!.trim();
  return sense.length > MAX_MEANING_LENGTH ? `${sense.slice(0, MAX_MEANING_LENGTH - 1)}…` : sense;
}

export interface MatchPair {
  word: string;
  en: string;
}

/**
 * Builds one word→meaning multiple-choice question: `pair`'s meaning plus three distractor
 * meanings from `pool`. Distractors never repeat the answer (two words can share a gloss).
 */
export function buildMatchQuestion(pair: MatchPair, pool: readonly MatchPair[], seed: number): MatchQuestion {
  const rng = makeRng(seed);
  const others = [...new Set(pool.map((p) => p.en))].filter((en) => en !== pair.en);
  const distractors = pickRandom(others, CHOICE_COUNT - 1, rng);
  const choices = seededShuffle([pair.en, ...distractors], rng);
  return { word: pair.word, choices, correctIndex: choices.indexOf(pair.en) };
}

/**
 * Builds a deck of `deckSize` word→meaning questions from `pairs`. Pure function of
 * (pairs, seed, deckSize) — same inputs, same deck.
 */
export function buildMatchDeck(pairs: readonly MatchPair[], seed: number, deckSize = 10): MatchQuestion[] {
  if (new Set(pairs.map((p) => p.en)).size < CHOICE_COUNT) return [];
  const rng = makeRng(seed);
  const chosen = seededShuffle(pairs, rng).slice(0, Math.min(deckSize, pairs.length));
  return chosen.map((pair, i) => buildMatchQuestion(pair, pairs, seed + i + 1));
}
