/**
 * Independent vowels, digits, ottakshara (vattu), arkavattu, and leftover
 * matra marks in the Nudi 01-e / Baraha Latin-1 glyph font.
 */

/** Standalone vowels and anusvara/visarga. */
export const VOWEL_TO_UNI: Record<string, string> = {
  C: "ಅ",
  D: "ಆ",
  E: "ಇ",
  F: "ಈ",
  G: "ಉ",
  H: "ಊ",
  IÄ: "ಋ",
  J: "ಎ",
  K: "ಏ",
  L: "ಐ",
  M: "ಒ",
  N: "ಓ",
  O: "ಔ",
  A: "ಂ",
  B: "ಃ",
};

/** The font redraws ASCII 0–9 as Kannada digits. */
export const DIGIT_TO_UNI: Record<string, string> = {
  "0": "೦",
  "1": "೧",
  "2": "೨",
  "3": "೩",
  "4": "೪",
  "5": "೫",
  "6": "೬",
  "7": "೭",
  "8": "೮",
  "9": "೯",
};

/**
 * Subscript consonants (ottakshara). Codes are the Latin-1 letters whose
 * glyphs the font redrew as vattu shapes. ß = ನ is the well-known ಕನ್ನಡ case;
 * å = ಯ from the arkavattu/ya-vattu glyph slot.
 */
export const VATTU_TO_CONS: Record<string, string> = {
  ß: "ನ",
  å: "ಯ",
  ä: "ಯ",
};

/** ð (Latin eth) is the reph / arkavattu glyph — ರ್ drawn above the next letter. */
export const ARKAVATTU = "ð";

/**
 * Marks that finish a vowel after the base syllable (and any vattu) is already
 * in the stream. Applied to the last Unicode akshara.
 */
export const BROKEN_MARKS = ["Ã", "Ä", "Æ", "Ê"] as const;

export type BrokenMark = (typeof BROKEN_MARKS)[number];

export function isBrokenMark(ch: string): ch is BrokenMark {
  return (BROKEN_MARKS as readonly string[]).includes(ch);
}

const MATRA_II: Record<string, string> = { "ಿ": "ೀ", "ೆ": "ೇ", "ೊ": "ೋ" };
const MATRA_O: Record<string, string> = { "ೆ": "ೊ" };
const MATRA_AI: Record<string, string> = { "ೆ": "ೈ" };

export function applyBrokenMark(syllable: string, mark: BrokenMark): string | null {
  const last = syllable.at(-1) ?? "";
  if (mark === "Ã") {
    const next = MATRA_II[last];
    return next ? syllable.slice(0, -1) + next : null;
  }
  if (mark === "Ê") {
    const next = MATRA_AI[last];
    return next ? syllable.slice(0, -1) + next : null;
  }
  if (mark === "Æ") {
    const asO = MATRA_O[last];
    if (asO) return syllable.slice(0, -1) + asO;
    if (isBareConsonant(last)) return syllable + "ೂ";
    return null;
  }
  if (isBareConsonant(last)) return syllable + "ು";
  return null;
}

function isBareConsonant(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0c95 && c <= 0x0cb9) || c === 0x0cde;
}

export const VOWEL_TO_ASCII: Record<string, string> = invert(VOWEL_TO_UNI);
export const DIGIT_TO_ASCII: Record<string, string> = invert(DIGIT_TO_UNI);

/** Canonical vattu code per consonant (first mapping wins). */
export const CONS_TO_VATTU: Record<string, string> = {};
for (const [ascii, cons] of Object.entries(VATTU_TO_CONS)) {
  if (CONS_TO_VATTU[cons] === undefined) CONS_TO_VATTU[cons] = ascii;
}

function invert(map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [ascii, uni] of Object.entries(map)) {
    if (out[uni] === undefined) out[uni] = ascii;
  }
  return out;
}
