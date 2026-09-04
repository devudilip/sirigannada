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

/**
 * Builds one word→meaning multiple-choice question: `entry`'s own sense plus three distractor
 * senses drawn from `pool` (typically the rest of the deck's source list, e.g. daily.json).
 */
export function buildMatchQuestion(entry: DictEntry, pool: readonly DictEntry[], seed: number): MatchQuestion {
  const rng = makeRng(seed);
  const entryIndex = pool.indexOf(entry);
  const distractorSource = pool.filter((_, i) => i !== entryIndex);
  const distractors = pickRandom(distractorSource, CHOICE_COUNT - 1, rng).map(firstSense);
  const correct = firstSense(entry);
  const choices = seededShuffle([correct, ...distractors], rng);
  return { word: entry.word, choices, correctIndex: choices.indexOf(correct) };
}

/**
 * Builds a deck of `deckSize` word→meaning questions from `entries` (only entries with a usable
 * def are eligible). Pure function of (entries, seed, deckSize) — same inputs, same deck.
 */
export function buildMatchDeck(entries: readonly DictEntry[], seed: number, deckSize = 10): MatchQuestion[] {
  const eligible = entries.filter((e) => e.defs.length > 0 && e.defs[0]!.text.trim().length > 0);
  if (eligible.length < CHOICE_COUNT) return [];
  const rng = makeRng(seed);
  const chosen = seededShuffle(eligible, rng).slice(0, Math.min(deckSize, eligible.length));
  return chosen.map((entry, i) => buildMatchQuestion(entry, eligible, seed + i + 1));
}
