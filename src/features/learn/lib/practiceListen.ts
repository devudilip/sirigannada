import { ALPHABET_ORDER, AVARGIYA, VARGA_CA, VARGA_KA, VARGA_PA, VARGA_TA, VARGA_TTA, VOWELS, YOGAVAHA } from "@/lib/kannadaAlphabet";
import { letterMedia } from "./letterMedia";
import { LETTER_WORDS, type LetterWord } from "./letterWords";
import { makeRng, seededShuffle } from "./practiceRandom";

/** One letter-choice question: `letter` is the answer; `word` is set for "first letter" prompts. */
export interface LetterQuestion {
  letter: string;
  word?: LetterWord;
  choices: string[];
  correctIndex: number;
}

const CHOICE_COUNT = 4;

/** Rows of the school chart: letters in one row sound alike (ಕ ಖ ಗ ಘ). */
const ROWS: readonly (readonly string[])[] = [
  [...VOWELS, ...YOGAVAHA], VARGA_KA, VARGA_CA, VARGA_TTA, VARGA_TA, VARGA_PA, AVARGIYA,
];

/** Sounds learners mix up across rows (retroflex/dental, ಲ/ಳ, the sibilants) or within one (short/long vowels). */
const CONFUSABLE: readonly (readonly string[])[] = [
  ["ಅ", "ಆ"], ["ಇ", "ಈ"], ["ಉ", "ಊ"], ["ಎ", "ಏ"], ["ಒ", "ಓ"],
  ["ಟ", "ತ"], ["ಠ", "ಥ"], ["ಡ", "ದ"], ["ಢ", "ಧ"], ["ಣ", "ನ"], ["ಲ", "ಳ"], ["ಶ", "ಷ", "ಸ"],
];

/** The 49 letters that have a recorded pronunciation, in chart order. */
export const HEARABLE_LETTERS: readonly string[] = ALPHABET_ORDER.filter((letter) => letterMedia(letter) !== null);

/**
 * Three wrong choices for `letter`, closest-sounding first: confusable partners, then the rest of
 * its chart row, then anything in `pool`, each tier shuffled. Only letters in `pool` are used.
 */
export function confusableLetters(letter: string, pool: readonly string[], rng: () => number): string[] {
  const near = (groups: readonly (readonly string[])[]) =>
    seededShuffle(groups.filter((group) => group.includes(letter)).flat(), rng);
  const ranked = [...near(CONFUSABLE), ...near(ROWS), ...seededShuffle(pool, rng)];
  return [...new Set(ranked)].filter((l) => l !== letter && pool.includes(l)).slice(0, CHOICE_COUNT - 1);
}

function letterQuestion(letter: string, pool: readonly string[], rng: () => number, word?: LetterWord): LetterQuestion {
  const choices = seededShuffle([letter, ...confusableLetters(letter, pool, rng)], rng);
  return { letter, word, choices, correctIndex: choices.indexOf(letter) };
}

/** "Hear the letter": a recorded letter plays; pick it from four. Pure function of (seed, deckSize). */
export function buildHearLetterDeck(seed: number, deckSize = 10): LetterQuestion[] {
  const rng = makeRng(seed);
  return seededShuffle(HEARABLE_LETTERS, rng)
    .slice(0, deckSize)
    .map((letter) => letterQuestion(letter, HEARABLE_LETTERS, rng));
}

/** "First letter": a pictured word; pick the letter it begins with. Pure function of (seed, deckSize). */
export function buildFirstLetterDeck(seed: number, deckSize = 10): LetterQuestion[] {
  const rng = makeRng(seed);
  const pictured = Object.entries(LETTER_WORDS).flatMap(([letter, words]) =>
    words.filter((word) => word.picture).map((word) => ({ letter, word })),
  );
  return seededShuffle(pictured, rng)
    .slice(0, deckSize)
    .map(({ letter, word }) => letterQuestion(letter, HEARABLE_LETTERS, rng, word));
}
