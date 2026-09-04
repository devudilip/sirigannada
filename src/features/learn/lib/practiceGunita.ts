import { GUNITA_SIGNS, SCHOOL_CONSONANTS, VOWELS, gunitaksharaForm } from "@/lib/kannadaAlphabet";
import { makeRng, pickRandom, seededShuffle } from "./practiceRandom";

export type GunitaDirection = "compose" | "identify";

export interface GunitaQuestion {
  direction: GunitaDirection;
  /** "compose": show consonant + this vowel label, pick the combined akshara. */
  /** "identify": show this combined akshara, pick which vowel/sign it uses. */
  consonant: string;
  /** "compose" only: the vowel/sign label the prompt asks the user to combine with `consonant`. */
  signLabel: string;
  choices: string[];
  correctIndex: number;
}

const CHOICE_COUNT = 4;

/** Legible standalone label for each GUNITA_SIGNS entry: the plain vowel, or the sign itself for the last three (anusvara, visarga, virama), which are already standalone characters. */
export const SIGN_LABELS: readonly string[] = [...VOWELS, "ಂ", "ಃ", "್"];

function buildComposeQuestion(consonant: string, signIndex: number, rng: () => number): GunitaQuestion {
  const correct = gunitaksharaForm(consonant, GUNITA_SIGNS[signIndex]!);
  const distractorSigns = pickRandom(GUNITA_SIGNS, CHOICE_COUNT - 1, rng, signIndex);
  const choices = seededShuffle(
    [correct, ...distractorSigns.map((sign) => gunitaksharaForm(consonant, sign))],
    rng,
  );
  return {
    direction: "compose",
    consonant,
    signLabel: SIGN_LABELS[signIndex]!,
    choices,
    correctIndex: choices.indexOf(correct),
  };
}

function buildIdentifyQuestion(consonant: string, signIndex: number, rng: () => number): GunitaQuestion {
  const akshara = gunitaksharaForm(consonant, GUNITA_SIGNS[signIndex]!);
  const correct = SIGN_LABELS[signIndex]!;
  const distractors = pickRandom(SIGN_LABELS, CHOICE_COUNT - 1, rng, signIndex);
  const choices = seededShuffle([correct, ...distractors], rng);
  return { direction: "identify", consonant: akshara, signLabel: "", choices, correctIndex: choices.indexOf(correct) };
}

/**
 * Builds a deck of `deckSize` gunitakshara (kagunita) questions, alternating "compose" (consonant
 * + vowel → akshara) and "identify" (akshara → vowel) prompts. Pure function of (seed, deckSize).
 */
export function buildGunitaDeck(seed: number, deckSize = 10): GunitaQuestion[] {
  const rng = makeRng(seed);
  const deck: GunitaQuestion[] = [];
  for (let i = 0; i < deckSize; i++) {
    const consonant = SCHOOL_CONSONANTS[Math.floor(rng() * SCHOOL_CONSONANTS.length)]!;
    const signIndex = Math.floor(rng() * GUNITA_SIGNS.length);
    const direction: GunitaDirection = i % 2 === 0 ? "compose" : "identify";
    deck.push(
      direction === "compose"
        ? buildComposeQuestion(consonant, signIndex, rng)
        : buildIdentifyQuestion(consonant, signIndex, rng),
    );
  }
  return deck;
}
