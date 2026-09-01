/**
 * Kannada script utilities shared by the build scripts and the browser.
 * Pure functions, no dependencies. Written from scratch for Sirigannada.
 */

const VIRAMA = "\u0CCD";
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

/** Independent vowels ಅ..ಔ and consonants ಕ..ಹ, ೞ, ಱ. */
export function isKannadaLetter(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0c85 && c <= 0x0c94) || (c >= 0x0c95 && c <= 0x0cb9) || c === 0x0cde;
}

export function normalise(text: string): string {
  return text.normalize("NFC").replace(ZERO_WIDTH, "").trim();
}

/** Shard key: the first Kannada letter of a word, or "_" for anything else. */
export function shardKey(word: string): string {
  const first = normalise(word).codePointAt(0);
  if (first === undefined) return "_";
  const ch = String.fromCodePoint(first);
  return isKannadaLetter(ch) ? ch : "_";
}

/* ------------------------------ phonetic key ------------------------------ */

// Collapse distinctions most speakers blur when spelling from sound.
const LETTER_FOLD: Record<string, string> = {
  // long → short independent vowels
  "ಆ": "ಅ", "ಈ": "ಇ", "ಊ": "ಉ", "ಏ": "ಎ", "ಓ": "ಒ", "ಋ": "ರಿ",
  // long → short vowel signs (ಾ drops entirely: inherent 'a')
  "ಾ": "", "ೀ": "ಿ", "ೂ": "ು", "ೇ": "ೆ", "ೋ": "ೊ", "ೃ": "ರಿ",
  // aspirated → plain
  "ಖ": "ಕ", "ಘ": "ಗ", "ಛ": "ಚ", "ಝ": "ಜ", "ಠ": "ಟ", "ಢ": "ಡ",
  "ಥ": "ತ", "ಧ": "ದ", "ಫ": "ಪ", "ಭ": "ಬ",
  // sibilants, liquids, nasals
  "ಶ": "ಸ", "ಷ": "ಸ", "ಳ": "ಲ", "ೞ": "ಲ", "ಱ": "ರ", "ಣ": "ನ", "ಙ": "ನ", "ಞ": "ನ",
  // visarga rarely matters for lookup
  "ಃ": "",
};

/**
 * Loose phonetic key. Two words with the same key "sound alike" to a learner.
 * Not reversible; only for matching. Examples: ಶಾಲೆ and ಸಾಲೆ share a key; ಕನ್ನಡ ≈ ಕನಡ.
 */
export function phoneticKey(word: string): string {
  const src = normalise(word);
  let out = "";
  for (const ch of src) {
    const folded = LETTER_FOLD[ch];
    out += folded === undefined ? ch : folded;
  }
  // ನ್ನ → ನ, ಲ್ಲ → ಲ (doubled consonants)
  out = out.replace(/([\u0C95-\u0CB9])\u0CCD\1/g, "$1");
  // anusvara before a consonant is just a nasal: keep as a single marker
  return out.replace(/\u0C82+/g, "\u0C82");
}

/* ------------------------ Latin → Kannada transliteration ------------------------ */

const VOWELS: Record<string, [independent: string, sign: string]> = {
  a: ["ಅ", ""], aa: ["ಆ", "ಾ"], A: ["ಆ", "ಾ"],
  i: ["ಇ", "ಿ"], ii: ["ಈ", "ೀ"], I: ["ಈ", "ೀ"], ee: ["ಈ", "ೀ"],
  u: ["ಉ", "ು"], uu: ["ಊ", "ೂ"], U: ["ಊ", "ೂ"], oo: ["ಊ", "ೂ"],
  e: ["ಎ", "ೆ"], E: ["ಏ", "ೇ"], ae: ["ಏ", "ೇ"],
  ai: ["ಐ", "ೈ"], o: ["ಒ", "ೊ"], O: ["ಓ", "ೋ"], au: ["ಔ", "ೌ"], ou: ["ಔ", "ೌ"],
  Ru: ["ಋ", "ೃ"],
};

const CONSONANTS: Record<string, string> = {
  k: "ಕ", kh: "ಖ", g: "ಗ", gh: "ಘ", ng: "ಂಗ",
  ch: "ಚ", chh: "ಛ", c: "ಚ", j: "ಜ", jh: "ಝ", ny: "ಞ",
  T: "ಟ", Th: "ಠ", D: "ಡ", Dh: "ಢ", N: "ಣ",
  t: "ತ", th: "ಥ", d: "ದ", dh: "ಧ", n: "ನ",
  p: "ಪ", ph: "ಫ", f: "ಫ", b: "ಬ", bh: "ಭ", m: "ಮ",
  y: "ಯ", r: "ರ", l: "ಲ", v: "ವ", w: "ವ",
  sh: "ಶ", Sh: "ಷ", S: "ಷ", s: "ಸ", h: "ಹ", L: "ಳ",
  x: "ಕ್ಸ", z: "ಜ", q: "ಕ",
};

const MAX_TOKEN = 3;

/**
 * Convert Latin phonetic input to Kannada (Baraha/ITRANS-style, lower-case friendly).
 * "kannaDa" → ಕನ್ನಡ, "sirigannada" → ಸಿರಿಗನ್ನದ (close enough for phonetic search).
 * Trailing consonants get a virama; "M" or "m" before a consonant becomes anusvara is NOT
 * attempted — keep the scheme predictable.
 */
export function latinToKannada(input: string): string {
  const s = input.replace(/[^A-Za-z]/g, "");
  let i = 0;
  let out = "";
  let pendingConsonant = false;

  while (i < s.length) {
    let matched = false;
    for (let len = Math.min(MAX_TOKEN, s.length - i); len > 0; len--) {
      const tok = s.slice(i, i + len);
      const vowel = VOWELS[tok] ?? VOWELS[tok.toLowerCase()];
      if (vowel) {
        out += pendingConsonant ? vowel[1] : vowel[0];
        pendingConsonant = false;
        i += len; matched = true; break;
      }
      const cons = CONSONANTS[tok] ?? CONSONANTS[tok.toLowerCase()];
      if (cons) {
        if (pendingConsonant) out += VIRAMA;
        out += cons;
        pendingConsonant = true;
        i += len; matched = true; break;
      }
    }
    if (!matched) i += 1; // skip unknown character
  }
  if (pendingConsonant) out += VIRAMA;
  return out;
}

/** True if the string contains any Kannada-block character. */
export function hasKannada(text: string): boolean {
  return /[\u0C80-\u0CFF]/.test(text);
}
