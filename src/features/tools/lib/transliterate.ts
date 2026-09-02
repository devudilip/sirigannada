const VIRAMA = "್";

const INDEPENDENT_VOWELS: Record<string, string> = {
  ಅ: "a", ಆ: "ā", ಇ: "i", ಈ: "ī", ಉ: "u", ಊ: "ū",
  ಋ: "r̥", ೠ: "r̥̄", ಌ: "l̥", ೡ: "l̥̄",
  ಎ: "e", ಏ: "ē", ಐ: "ai", ಒ: "o", ಓ: "ō", ಔ: "au",
};

const VOWEL_SIGNS: Record<string, string> = {
  "ಾ": "ā", "ಿ": "i", "ೀ": "ī", "ು": "u", "ೂ": "ū",
  "ೃ": "r̥", "ೄ": "r̥̄", "ೢ": "l̥", "ೣ": "l̥̄",
  "ೆ": "e", "ೇ": "ē", "ೈ": "ai", "ೊ": "o", "ೋ": "ō", "ೌ": "au",
};

const CONSONANTS_TO_ISO: Record<string, string> = {
  ಕ: "k", ಖ: "kh", ಗ: "g", ಘ: "gh", ಙ: "ṅ",
  ಚ: "c", ಛ: "ch", ಜ: "j", ಝ: "jh", ಞ: "ñ",
  ಟ: "ṭ", ಠ: "ṭh", ಡ: "ḍ", ಢ: "ḍh", ಣ: "ṇ",
  ತ: "t", ಥ: "th", ದ: "d", ಧ: "dh", ನ: "n",
  ಪ: "p", ಫ: "ph", ಬ: "b", ಭ: "bh", ಮ: "m",
  ಯ: "y", ರ: "r", ಱ: "ṟ", ಲ: "l", ವ: "v",
  ಶ: "ś", ಷ: "ṣ", ಸ: "s", ಹ: "h", ಳ: "ḷ", ೞ: "ḻ",
};

const MARKS_TO_ISO: Record<string, string> = {
  "ಂ": "ṁ",
  "ಃ": "ḥ",
  "ಁ": "m̐",
  "ಽ": "’",
};

const ISO_VOWELS: Record<string, [independent: string, sign: string]> = {
  a: ["ಅ", ""], ā: ["ಆ", "ಾ"], i: ["ಇ", "ಿ"], ī: ["ಈ", "ೀ"],
  u: ["ಉ", "ು"], ū: ["ಊ", "ೂ"], "r̥": ["ಋ", "ೃ"], "r̥̄": ["ೠ", "ೄ"],
  "l̥": ["ಌ", "ೢ"], "l̥̄": ["ೡ", "ೣ"], e: ["ಎ", "ೆ"], ē: ["ಏ", "ೇ"],
  ai: ["ಐ", "ೈ"], o: ["ಒ", "ೊ"], ō: ["ಓ", "ೋ"], au: ["ಔ", "ೌ"],
};

const ISO_CONSONANTS: Record<string, string> = Object.fromEntries(
  Object.entries(CONSONANTS_TO_ISO).map(([kannada, iso]) => [iso, kannada]),
);

const ISO_MARKS: Record<string, string> = {
  "ṃ": "ಂ",
  "ṁ": "ಂ",
  "ḥ": "ಃ",
  "m̐": "ಁ",
  "’": "ಽ",
};

const ISO_TOKENS = [
  ...Object.keys(ISO_VOWELS),
  ...Object.keys(ISO_CONSONANTS),
  ...Object.keys(ISO_MARKS),
].sort((a, b) => b.length - a.length);

function hasOwn(record: Record<string, string>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

/** Convert Unicode Kannada text to ISO 15919 romanization. */
export function kannadaToIso(input: string): string {
  const chars = [...input.normalize("NFC")];
  let output = "";

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i] ?? "";
    const consonant = CONSONANTS_TO_ISO[char];
    if (consonant !== undefined) {
      output += consonant;
      const next = chars[i + 1] ?? "";
      if (hasOwn(VOWEL_SIGNS, next)) {
        output += VOWEL_SIGNS[next];
        i++;
      } else if (next === VIRAMA) {
        i++;
      } else {
        output += "a";
      }
      continue;
    }

    output += INDEPENDENT_VOWELS[char] ?? MARKS_TO_ISO[char] ?? char;
  }

  return output.normalize("NFC");
}

/** Convert ISO 15919 romanization to Unicode Kannada text. */
export function isoToKannada(input: string): string {
  const source = input.normalize("NFC").toLocaleLowerCase("en");
  let output = "";
  let pendingConsonant = false;
  let index = 0;

  while (index < source.length) {
    const token = ISO_TOKENS.find((candidate) => source.startsWith(candidate, index));
    if (!token) {
      if (pendingConsonant) {
        output += VIRAMA;
        pendingConsonant = false;
      }
      output += source[index] ?? "";
      index++;
      continue;
    }

    const vowel = ISO_VOWELS[token];
    if (vowel) {
      output += pendingConsonant ? vowel[1] : vowel[0];
      pendingConsonant = false;
    } else {
      const consonant = ISO_CONSONANTS[token];
      if (consonant) {
        if (pendingConsonant) output += VIRAMA;
        output += consonant;
        pendingConsonant = true;
      } else {
        if (pendingConsonant) {
          output += VIRAMA;
          pendingConsonant = false;
        }
        output += ISO_MARKS[token] ?? token;
      }
    }
    index += token.length;
  }

  if (pendingConsonant) output += VIRAMA;
  return output.normalize("NFC");
}
