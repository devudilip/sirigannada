/** Kannada digits ೦–೯ (U+0CE6…U+0CEF). */
const KN_DIGIT_ZERO = 0x0ce6;

export const MAX_INTEGER = 1_000_000_000;

const ONES = [
  "",
  "ಒಂದು",
  "ಎರಡು",
  "ಮೂರು",
  "ನಾಲ್ಕು",
  "ಐದು",
  "ಆರು",
  "ಏಳು",
  "ಎಂಟು",
  "ಒಂಬತ್ತು",
] as const;

const TEENS = [
  "ಹತ್ತು",
  "ಹನ್ನೊಂದು",
  "ಹನ್ನೆರಡು",
  "ಹದಿಮೂರು",
  "ಹದಿನಾಲ್ಕು",
  "ಹದಿನೈದು",
  "ಹದಿನಾರು",
  "ಹದಿನೇಳು",
  "ಹದಿನೆಂಟು",
  "ಹತ್ತೊಂಬತ್ತು",
] as const;

const TENS = [
  "",
  "",
  "ಇಪ್ಪತ್ತು",
  "ಮೂವತ್ತು",
  "ನಲವತ್ತು",
  "ಐವತ್ತು",
  "ಅರವತ್ತು",
  "ಎಪ್ಪತ್ತು",
  "ಎಂಬತ್ತು",
  "ತೊಂಬತ್ತು",
] as const;

const HUNDREDS = [
  "",
  "ನೂರು",
  "ಇನ್ನೂರು",
  "ಮುನ್ನೂರು",
  "ನಾನೂರು",
  "ಐನೂರು",
  "ಆರುನೂರು",
  "ಏಳುನೂರು",
  "ಎಂಟುನೂರು",
  "ಒಂಬೈನೂರು",
] as const;

/** Independent vowel → combining sign, for tens+ones sandhi (ಇಪ್ಪತ್ತೊಂದು). */
const VOWEL_SIGN: Record<string, string> = {
  ಅ: "",
  ಆ: "ಾ",
  ಇ: "ಿ",
  ಈ: "ೀ",
  ಉ: "ು",
  ಊ: "ೂ",
  ಎ: "ೆ",
  ಏ: "ೇ",
  ಐ: "ೈ",
  ಒ: "ೊ",
  ಓ: "ೋ",
  ಔ: "ೌ",
};

function wordAt(list: readonly string[], index: number): string {
  const word = list[index];
  if (word === undefined) throw new RangeError("numeral index out of range");
  return word;
}

function joinTensOnes(tensWord: string, onesWord: string): string {
  const stem = tensWord.endsWith("ು") ? tensWord.slice(0, -1) : tensWord;
  const first = onesWord.codePointAt(0);
  if (first === undefined) return stem;
  const letter = String.fromCodePoint(first);
  const sign = VOWEL_SIGN[letter];
  if (sign === undefined) return stem + onesWord;
  return stem + sign + onesWord.slice(letter.length);
}

function belowHundred(n: number): string {
  if (n <= 0) return "";
  if (n < 10) return wordAt(ONES, n);
  if (n < 20) return wordAt(TEENS, n - 10);
  const tensWord = wordAt(TENS, Math.floor(n / 10));
  const ones = n % 10;
  if (ones === 0) return tensWord;
  return joinTensOnes(tensWord, wordAt(ONES, ones));
}

function belowThousand(n: number): string {
  if (n < 100) return belowHundred(n);
  const hundredsWord = wordAt(HUNDREDS, Math.floor(n / 100));
  const rest = n % 100;
  if (rest === 0) return hundredsWord;
  return `${hundredsWord} ${belowHundred(rest)}`;
}

function withUnit(count: number, unit: string): string {
  return `${belowThousand(count)} ${unit}`;
}

export function arabicToKannadaDigits(text: string): string {
  return text.replace(/[0-9]/g, (ch) => String.fromCharCode(KN_DIGIT_ZERO + Number(ch)));
}

export function kannadaToArabicDigits(text: string): string {
  return text.replace(/[\u0CE6-\u0CEF]/g, (ch) => String(ch.charCodeAt(0) - KN_DIGIT_ZERO));
}

/**
 * Integer 0…10^9 inclusive, Indian grouping: ಸಾವಿರ, ಲಕ್ಷ, ಕೋಟಿ.
 * 1200 → ಒಂದು ಸಾವಿರ ಇನ್ನೂರು; 10^9 → ನೂರು ಕೋಟಿ.
 */
export function numberToKannadaWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_INTEGER) {
    throw new RangeError(`expected integer 0–${MAX_INTEGER}`);
  }
  if (n === 0) return "ಸೊನ್ನೆ";

  const crore = Math.floor(n / 10_000_000);
  let rest = n % 10_000_000;
  const lakh = Math.floor(rest / 100_000);
  rest %= 100_000;
  const thousand = Math.floor(rest / 1000);
  rest %= 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(withUnit(crore, "ಕೋಟಿ"));
  if (lakh > 0) parts.push(withUnit(lakh, "ಲಕ್ಷ"));
  if (thousand > 0) parts.push(withUnit(thousand, "ಸಾವಿರ"));
  if (rest > 0) parts.push(belowThousand(rest));
  return parts.join(" ");
}

export function parseNonNegativeInteger(text: string): number | null {
  const digits = kannadaToArabicDigits(text).replace(/[,_\s]/g, "");
  if (digits === "" || !/^\d+$/.test(digits) || digits.length > 10) return null;
  const n = Number(digits);
  if (!Number.isInteger(n) || n < 0 || n > MAX_INTEGER) return null;
  return n;
}
