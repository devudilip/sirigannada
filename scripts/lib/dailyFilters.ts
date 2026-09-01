/** Headword and definition rejection used by the daily-word picker. */

const EXCLUDED_MARKERS = ["(obsolete)", "(obs.)", "(hist.)", "archaic", "vulgar", "slang"];
const BAD_HEADWORD = /[\s\-A-Za-z0-9]/;
/** Old letters, visarga, ZWNJ, ZWJ. */
const OLD_OR_INVISIBLE = /[\u0CB1\u0CDE\u0C83\u200C\u200D]/;
const VIRAMA = "\u0CCD";
const VIRAMA_RA_VIRAMA = `${VIRAMA}\u0CB0${VIRAMA}`;
const DOUBLE_VIRAMA = `${VIRAMA}${VIRAMA}`;
const RARE_INITIAL = /^[ಙಞ]/;
const ANUSVARA_STUB = /^[\u0C85-\u0CB9][\u0CBE-\u0CCC]?ಂ$/;
const BARE_NAME = /^[A-ZĀĪŪĒŌŚṚ][A-Za-zà-öø-ÿāīūēōśṛṣṇṭḍḷ]*\.?$/;
const LONG_INDEP = new Set(["ಆ", "ಈ", "ಊ", "ಏ", "ಐ", "ಓ", "ಔ"]);
const LONG_SIGN = new Set(["ಾ", "ೀ", "ೂ", "ೇ", "ೈ", "ೋ", "ೌ"]);
/** Rare tatsamas and Old-Kannada nouns that survive other filters. */
const DENIED_HEADWORDS = new Set([
  "ವಾಜಿ",
  "ವತ್ಸ",
  "ಫಣಿ",
  "ಕ್ಷಿತಿ",
  "ಅಂಶು",
  "ಅಶ್ರು",
  "ಪಸು",
  "ಪೊಡೆ",
  "ನಲ್ಮೆ",
  "ಒಸಗೆ",
  "ಇಂಬು",
  "ತೊತ್ತು",
  "ವಾರಿ",
  "ಉದಕ",
  "ನೇತ್ರ",
  "ಅಕ್ಷಿ",
  "ಚಕ್ಷು",
  "ಅಶ್ವ",
  "ತುರಗ",
  "ಅಂಬು",
  "ಕ್ಷೀರ",
  "ತೋಯ",
  "ಮೃಗ",
  "ಶಶಿ",
  "ಧರೆ",
  "ಮಹೀ",
  "ತನುಜ",
  "ಪಯ",
  "ಶಾರ್ದೂಲ",
  "ಸಿಂಧು",
  "ಗಜೇಂದ್ರ",
]);
/** Sanskrit combining forms (ಕ್ರಿ, ತ್ರಿ, ದ್ವಿ, ದ್ಯು). */
const COMBINING_PREFIX = /^[\u0C95-\u0CB9]\u0CCD[ರಯವಲ][ಿು]$/;
/** Old ಎರ್ದೆ / ಬರ್ದು shapes. */
const OLD_RDA = /ರ್ದ[ೆುಿ]$/;
const Y_VIRAMA_C = /ಯ್[\u0C95-\u0CB9]/;
const L_VIRAMA_C = /ಳ್(?!ಳ)[\u0C95-\u0CB9]/;
const OLD_CAUSATIVE = /[ರಲ]\u0CCDಚ/;
const OLD_VERB_END = /(?:ವಡೆ|ವೋಗು|ವೆರು|ವರಿ)$/;
const CONSONANT = /[\u0C95-\u0CB9]/;
const VOWEL_SIGN = /[\u0CBE-\u0CCC]/;
const SANDHI_AFTER = new Set(["ಗ", "ಬ", "ದ"]);

const BINOMIAL = /\b[A-Z][a-z]+ [a-z]{4,}\b/;
const BOTANICAL = /\b(plant|tree|family|species|genus)\b/i;
const ORDINAL_OF =
  /\bthe (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|\d+(?:st|nd|rd|th)) of\b/;

const SCHOLARLY = [
  "(in prosody",
  "(in music",
  "(in astrology",
  "(in grammar",
  "(in logic",
  "(in jainism",
  "(in vedic",
  "(in vaiṣṇavism",
  "(in śaivism",
  "(in vīraśaivism",
  "(mythology",
  "(in arithmetic",
  "a kind of",
  "the name of",
  "name of a",
  "a particular",
  "(myth.",
  "(astrol.",
  "(pros.",
  "(rhet.",
  "(jain.",
  "(vīr.",
  "(chem.",
  "(arith.)",
  "(pl.)",
  "(in comp",
  "(dial.)",
  "(correctly",
  "(in pl",
  "battlefield",
  "battle field",
  "vertebral",
  "oblation",
  "cycle of birth",
  "he who",
  "she who",
  "one who",
  "a man who",
  "a woman who",
  "a person who",
  "sub-caste",
  "the goddess",
  "goddess of",
  "the supreme being",
  "the food of the gods",
  "a monk",
  "followers of",
  "abounding",
  "(said of",
  "(used only",
  "(rightly,",
  "(masc.)",
  "(coll.)",
  "the vowel",
  "sacrifice",
  "personified",
  "an old measure",
  "lord of gods",
  "belonging to a caste",
  "a range of hills",
  "a beloved",
];

const PROPER_NOUN = [
  /\bname of\b/,
  /\ba town\b/,
  /\ba village\b/,
  /\ba river\b/,
  /\ba mountain\b/,
  /\ba king\b/,
  /\ba sage\b/,
  /\ba deity\b/,
  /\banother name for\b/,
];

export function codePointLength(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}

/** Independent vowels and consonants (one per akshara). */
export function aksharaCount(word: string): number {
  let n = 0;
  for (const ch of word) {
    const c = ch.codePointAt(0) ?? 0;
    if ((c >= 0x0c85 && c <= 0x0c94) || (c >= 0x0c95 && c <= 0x0cb9)) n++;
  }
  return n;
}

function firstAksharaIsLong(word: string): boolean {
  const cps = [...word];
  const first = cps[0];
  if (!first) return false;
  if (LONG_INDEP.has(first)) return true;
  for (let i = 1; i < cps.length; i++) {
    const ch = cps[i]!;
    const c = ch.codePointAt(0) ?? 0;
    if ((c >= 0x0c85 && c <= 0x0c94) || (c >= 0x0c95 && c <= 0x0cb9)) break;
    if (LONG_SIGN.has(ch)) return true;
  }
  return false;
}

/** Bare 2-akshara stem ending in ು with a short first vowel (ಕುಟು, ಮದು). Keeps ಕಂದು / conjuncts. */
export function isBareUStem(word: string): boolean {
  if (!word.endsWith("ು") || aksharaCount(word) !== 2 || firstAksharaIsLong(word)) return false;
  return !word.includes("ಂ") && !word.includes(VIRAMA);
}

export function isDeniedHeadword(word: string): boolean {
  return DENIED_HEADWORDS.has(word);
}

/** Old-Kannada ಪ- noun whose modern ಹ- form is in Alar (ಪಸು → ಹಸು). */
export function isPaNounWithHaTwin(word: string, pos: string, haWords: Set<string>): boolean {
  if (pos !== "noun" || !word.startsWith("ಪ")) return false;
  return haWords.has(`ಹ${word.slice(1)}`);
}

/** Gloss that points at the modern ಹ- form (= ಹಸು, see ಹೂವು). */
export function hasHaCrossRef(text: string): boolean {
  return /(?:=|see )\s*ಹ/.test(text);
}

/** Anusvara + ಗ/ಬ/ದ after a consonant or vowel sign, not at the start (keeps ಅಂಗಡಿ). */
function hasAnusvaraSandhi(word: string): boolean {
  const cps = [...word];
  if (cps.length <= 5) return false;
  for (let i = 2; i < cps.length - 1; i++) {
    if (cps[i] !== "ಂ") continue;
    const prev = cps[i - 1];
    const next = cps[i + 1];
    if (!prev || !next || !SANDHI_AFTER.has(next)) continue;
    if (CONSONANT.test(prev) || VOWEL_SIGN.test(prev)) return true;
  }
  return false;
}

export function isJunkHeadword(word: string): boolean {
  if (BAD_HEADWORD.test(word) || OLD_OR_INVISIBLE.test(word) || RARE_INITIAL.test(word)) return true;
  if (ANUSVARA_STUB.test(word) || word.includes("ಂನ")) return true;
  if (word.includes(VIRAMA_RA_VIRAMA) || word.includes(DOUBLE_VIRAMA)) return true;
  if (word.endsWith(VIRAMA)) return true;
  if (Y_VIRAMA_C.test(word) || L_VIRAMA_C.test(word) || OLD_CAUSATIVE.test(word)) return true;
  if (OLD_VERB_END.test(word) || hasAnusvaraSandhi(word)) return true;
  if (COMBINING_PREFIX.test(word) || OLD_RDA.test(word)) return true;
  const n = codePointLength(word);
  if (n <= 5 && word.endsWith("ಾ") && !word.includes(VIRAMA)) return true;
  return false;
}

export function isJunkDefinition(text: string): boolean {
  const trimmed = text.trim();
  if (BARE_NAME.test(trimmed) || text.includes("¸À")) return true;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("=")) return true;
  if (EXCLUDED_MARKERS.some((m) => lower.includes(m))) return true;
  if (lower.startsWith("one of the")) return true;
  if (SCHOLARLY.some((m) => lower.includes(m))) return true;
  if (PROPER_NOUN.some((re) => re.test(lower))) return true;
  if (ORDINAL_OF.test(lower)) return true;
  return BINOMIAL.test(text) && BOTANICAL.test(text);
}

/** Old-Kannada P- verbs (modern forms start with H). Nouns in P- are kept. */
export function isOldPVerb(word: string, pos: string): boolean {
  return pos === "verb" && /^(ಪೇ|ಪೊ|ಪೋ|ಪು|ಪೆ|ಪಿ|ಪೂ)/.test(word);
}
