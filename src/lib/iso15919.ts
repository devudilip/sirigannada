/**
 * Kannada → ISO 15919 transliteration. Written from scratch against the standard's
 * romanisation chart: inherent /a/ after every consonant unless a vowel sign or the
 * virama follows, ṁ for anusvara, ḥ for visarga, diacritics in NFC.
 *
 * This is a display helper, not a search key — see phoneticKey() in kannada.ts for that.
 */

const VIRAMA = "\u0CCD";
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
const RING_BELOW = "\u0325";
const MACRON = "\u0304";

/** Vocalic r/l: r̥ l̥ and their long forms r̥̄ l̥̄. */
const VOCALIC_R = `r${RING_BELOW}`;
const VOCALIC_R_LONG = `r${RING_BELOW}${MACRON}`;
const VOCALIC_L = `l${RING_BELOW}`;
const VOCALIC_L_LONG = `l${RING_BELOW}${MACRON}`;

const INDEPENDENT_VOWELS: Record<string, string> = {
  "ಅ": "a", "ಆ": "ā", "ಇ": "i", "ಈ": "ī", "ಉ": "u", "ಊ": "ū",
  "ಋ": VOCALIC_R, "ೠ": VOCALIC_R_LONG, "ಌ": VOCALIC_L, "ೡ": VOCALIC_L_LONG,
  "ಎ": "e", "ಏ": "ē", "ಐ": "ai", "ಒ": "o", "ಓ": "ō", "ಔ": "au",
};

const VOWEL_SIGNS: Record<string, string> = {
  "ಾ": "ā", "ಿ": "i", "ೀ": "ī", "ು": "u", "ೂ": "ū",
  "ೃ": VOCALIC_R, "ೄ": VOCALIC_R_LONG, "ೆ": "e", "ೇ": "ē", "ೈ": "ai",
  "ೊ": "o", "ೋ": "ō", "ೌ": "au",
};

/** Consonant bases, without the inherent vowel. */
const CONSONANTS: Record<string, string> = {
  "ಕ": "k", "ಖ": "kh", "ಗ": "g", "ಘ": "gh", "ಙ": "ṅ",
  "ಚ": "c", "ಛ": "ch", "ಜ": "j", "ಝ": "jh", "ಞ": "ñ",
  "ಟ": "ṭ", "ಠ": "ṭh", "ಡ": "ḍ", "ಢ": "ḍh", "ಣ": "ṇ",
  "ತ": "t", "ಥ": "th", "ದ": "d", "ಧ": "dh", "ನ": "n",
  "ಪ": "p", "ಫ": "ph", "ಬ": "b", "ಭ": "bh", "ಮ": "m",
  "ಯ": "y", "ರ": "r", "ಱ": "ṟ", "ಲ": "l", "ಳ": "ḷ", "ೞ": "ḻ",
  "ವ": "v", "ಶ": "ś", "ಷ": "ṣ", "ಸ": "s", "ಹ": "h",
};

const MARKS: Record<string, string> = { "ಂ": "ṁ", "ಃ": "ḥ", "ಽ": "’" };

const DIGITS: Record<string, string> = {
  "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4",
  "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9",
};

/**
 * Transliterate a Kannada string. Characters outside the Kannada block (spaces,
 * hyphens, Latin letters in mixed headwords) pass through untouched.
 * ಕನ್ನಡ → kannaḍa · ಋಷಿ → r̥ṣi · ಅಂಕ → aṁka · ದುಃಖ → duḥkha
 */
export function toIso15919(word: string): string {
  const chars = [...word.normalize("NFC").replace(ZERO_WIDTH, "")];
  let out = "";

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i] ?? "";
    const consonant = CONSONANTS[ch];
    if (consonant !== undefined) {
      out += consonant;
      const next = chars[i + 1] ?? "";
      const sign = VOWEL_SIGNS[next];
      if (next === VIRAMA) i++;
      else if (sign !== undefined) {
        out += sign;
        i++;
      } else out += "a";
      continue;
    }
    const standalone = INDEPENDENT_VOWELS[ch] ?? MARKS[ch] ?? DIGITS[ch];
    if (standalone !== undefined) {
      out += standalone;
      continue;
    }
    // A vowel sign or virama with no consonant before it carries no sound.
    if (VOWEL_SIGNS[ch] === undefined && ch !== VIRAMA) out += ch;
  }

  return out.normalize("NFC");
}

/**
 * True when Alar's own Latin phone says something the ISO form does not — Alar writes
 * ŋ for anusvara, ř for ೃ, ł for ೞ, and on truncated headwords its phone is the whole
 * word. Only then is it worth showing both lines.
 */
export function phoneDiffersFromIso(phone: string, iso: string): boolean {
  const norm = (s: string): string => s.normalize("NFC").trim().toLowerCase();
  return norm(phone) !== "" && norm(phone) !== norm(iso);
}
