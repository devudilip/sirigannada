import { latinToKannada } from "@/lib/kannada";

const LATIN_LETTER = /[A-Za-z]/;

/** What the answer field holds: the raw Latin as typed (if any) and the Kannada that fills the cells. */
export interface AnswerInput {
  /** Latin letters exactly as typed, or "" when the field holds Kannada. */
  latin: string;
  /** Kannada text that goes into the cells, is saved, and is checked. */
  kannada: string;
}

export function hasLatinLetters(text: string): boolean {
  return LATIN_LETTER.test(text);
}

/**
 * Reads the answer field. If it contains any Latin letter, the whole field is treated as Latin
 * and transliterated (Kannada mixed in is dropped, which keeps the rule simple and predictable);
 * otherwise it is Kannada typed directly. A half-typed word keeps its trailing virama ("man" →
 * ಮನ್): that is exactly what will be checked, and the next vowel replaces it ("mane" → ಮನೆ).
 * Capital M is anusvara here ("caMdra" → ಚಂದ್ರ) because many answers need ಂ.
 */
export function readAnswerInput(raw: string): AnswerInput {
  if (!hasLatinLetters(raw)) return { latin: "", kannada: raw };
  return { latin: raw, kannada: latinToKannada(raw, { anusvara: true }) };
}
