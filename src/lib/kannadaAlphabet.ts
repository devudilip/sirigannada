import type { StringKey } from "./i18n";

/**
 * Kannada varnamale (alphabet) data: vowels, consonants, gunitakshara (kagunita) forms, and
 * ottakshara (conjunct) teaching examples. Lives under src/lib/ (not a feature's lib/) because
 * the learn/alphabet page, the dictionary's on-screen keyboard, and the learn/practice quiz
 * feature all need it — see src/lib/speak.ts for the precedent of promoting a learn/-only helper
 * once a second feature needed it.
 */

/** One row in the ottakshara (conjunct) teaching list. */
export interface OttaksharaExample {
  conjunct: string;
  word: string;
  glossKey: StringKey;
}

export interface OttaksharaGroup {
  titleKey: StringKey;
  examples: readonly OttaksharaExample[];
}

export interface LetterGroup {
  titleKey: StringKey;
  letters: readonly string[];
}

/** School swaras (13). Inherent /a/ through /au/, including vocalic r. */
export const VOWELS = [
  "ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ಎ", "ಏ", "ಐ", "ಒ", "ಓ", "ಔ",
] as const;

/** Vocalics used in Sanskrit loans, not in everyday Kannada. */
export const SANSKRIT_VOWELS = ["ೠ", "ಌ", "ೡ"] as const;

/** Anusvara and visarga, shown on ಅ as in school charts. */
export const YOGAVAHA = ["ಅಂ", "ಅಃ"] as const;

export const VARGA_KA = ["ಕ", "ಖ", "ಗ", "ಘ", "ಙ"] as const;
export const VARGA_CA = ["ಚ", "ಛ", "ಜ", "ಝ", "ಞ"] as const;
export const VARGA_TTA = ["ಟ", "ಠ", "ಡ", "ಢ", "ಣ"] as const;
export const VARGA_TA = ["ತ", "ಥ", "ದ", "ಧ", "ನ"] as const;
export const VARGA_PA = ["ಪ", "ಫ", "ಬ", "ಭ", "ಮ"] as const;
export const AVARGIYA = ["ಯ", "ರ", "ಲ", "ವ", "ಶ", "ಷ", "ಸ", "ಹ", "ಳ"] as const;
export const ARCHAIC = ["ಱ", "ೞ"] as const;

/** 34 vyanjanas taught in Karnataka schools. */
export const SCHOOL_CONSONANTS = [
  ...VARGA_KA, ...VARGA_CA, ...VARGA_TTA, ...VARGA_TA, ...VARGA_PA, ...AVARGIYA,
] as const;

export const CONSONANT_GROUPS: readonly LetterGroup[] = [
  { titleKey: "alphabetVargaKa", letters: VARGA_KA },
  { titleKey: "alphabetVargaCa", letters: VARGA_CA },
  { titleKey: "alphabetVargaTta", letters: VARGA_TTA },
  { titleKey: "alphabetVargaTa", letters: VARGA_TA },
  { titleKey: "alphabetVargaPa", letters: VARGA_PA },
  { titleKey: "alphabetAvargiya", letters: AVARGIYA },
  { titleKey: "alphabetArchaic", letters: ARCHAIC },
];

/**
 * Kagunita attachments for one consonant: 13 vowels (inherent a first),
 * then anusvara, visarga, and virama (halant).
 */
export const GUNITA_SIGNS = [
  "", "ಾ", "ಿ", "ೀ", "ು", "ೂ", "ೃ", "ೆ", "ೇ", "ೈ", "ೊ", "ೋ", "ೌ", "ಂ", "ಃ", "್",
] as const;

export function gunitaksharaForm(consonant: string, sign: string): string {
  return `${consonant}${sign}`;
}

export function gunitaksharaRow(consonant: string): string[] {
  return GUNITA_SIGNS.map((sign) => gunitaksharaForm(consonant, sign));
}

export const OTTAKSHARA_GROUPS: readonly OttaksharaGroup[] = [
  {
    titleKey: "alphabetGeminate",
    examples: [
      { conjunct: "ಕ್ಕ", word: "ಅಕ್ಕ", glossKey: "alphabetGlossAkka" },
      { conjunct: "ನ್ನ", word: "ಅನ್ನ", glossKey: "alphabetGlossAnna" },
      { conjunct: "ಪ್ಪ", word: "ಅಪ್ಪ", glossKey: "alphabetGlossAppa" },
      { conjunct: "ಮ್ಮ", word: "ಅಮ್ಮ", glossKey: "alphabetGlossAmma" },
      { conjunct: "ಟ್ಟ", word: "ಬಟ್ಟೆ", glossKey: "alphabetGlossBatte" },
      { conjunct: "ಲ್ಲ", word: "ಎಲ್ಲ", glossKey: "alphabetGlossElla" },
      { conjunct: "ಣ್ಣ", word: "ಕಣ್ಣು", glossKey: "alphabetGlossKannu" },
    ],
  },
  {
    titleKey: "alphabetRaConjunct",
    examples: [
      { conjunct: "ಕ್ರ", word: "ಚಕ್ರ", glossKey: "alphabetGlossCakra" },
      { conjunct: "ತ್ರ", word: "ಮಿತ್ರ", glossKey: "alphabetGlossMitra" },
      { conjunct: "ಪ್ರ", word: "ಪ್ರೀತಿ", glossKey: "alphabetGlossPriti" },
      { conjunct: "ಶ್ರ", word: "ಶ್ರಮ", glossKey: "alphabetGlossSrama" },
    ],
  },
  {
    titleKey: "alphabetMixedConjunct",
    examples: [
      { conjunct: "ಕ್ಷ", word: "ಪಕ್ಷಿ", glossKey: "alphabetGlossPaksi" },
      { conjunct: "ಜ್ಞ", word: "ಜ್ಞಾನ", glossKey: "alphabetGlossJnana" },
      { conjunct: "ಷ್ಟ", word: "ಕಷ್ಟ", glossKey: "alphabetGlossKasta" },
      { conjunct: "ದ್ಧ", word: "ಬುದ್ಧಿ", glossKey: "alphabetGlossBuddhi" },
      { conjunct: "ತ್ಯ", word: "ಸತ್ಯ", glossKey: "alphabetGlossSatya" },
    ],
  },
];
