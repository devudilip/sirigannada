/**
 * Kannada inflection/conjugation stemming. Given a word as typed or tapped in a book, produces
 * candidate dictionary-headword stems: case-suffix stripping for nouns (ಮನೆಯಲ್ಲಿ → ಮನೆ) and
 * tense/person-suffix stripping for regular verbs (ಮಾಡಿದನು → ಮಾಡು), plus a small hand-curated
 * table for common irregular verbs whose past stem isn't recoverable by suffix stripping alone
 * (ಹೋದನು "he went" has no letter-level relation to ಹೋಗು "go" + a past suffix).
 */

/** Case suffixes that attach to Kannada nouns: ಗಳು, ದಲ್ಲಿ, ಗೆ, etc. */
const CASE_SUFFIXES = [
  "ಗಳನ್ನು", "ಗಳಲ್ಲಿ", "ಗಳಿಗೆ", "ಗಳ", "ಗಳು", "ವನ್ನು", "ಯನ್ನು", "ನನ್ನು", "ದಲ್ಲಿ", "ಯಲ್ಲಿ", "ನಲ್ಲಿ",
  "ದಿಂದ", "ಯಿಂದ", "ನಿಂದ", "ಕ್ಕೆ", "ಗೆ", "ಿಗೆ", "ವು", "ನು", "ಯು", "ದ", "ಯ", "ನ", "ವ", "ಗಳೆ",
];

/**
 * Tense/person suffixes for regular verbs. Roots in Alar are stored ending in ಉ (ಮಾಡು, ನೋಡು),
 * and stripping one of these and re-adding ಉ typically recovers it:
 * ಮಾಡಿದನು → ಮಾಡ + ಉ = ಮಾಡು, ನೋಡುತ್ತಾನೆ → ನೋಡ + ಉ = ನೋಡು.
 */
const VERB_SUFFIXES = [
  // Past: ಿದ marker + person ending
  "ಿದೆನು", "ಿದೆವು", "ಿದಿರಿ", "ಿದನು", "ಿದಳು", "ಿದರು", "ಿದವು", "ಿದೆ", "ಿತು", "ಿದ",
  // Present / habitual: ುತ್ತ marker + person ending
  "ುತ್ತೇನೆ", "ುತ್ತೇವೆ", "ುತ್ತೀಯ", "ುತ್ತೀರಿ", "ುತ್ತಾನೆ", "ುತ್ತಾಳೆ", "ುತ್ತಾರೆ", "ುತ್ತದೆ", "ುತ್ತವೆ",
  // Future: ುವ marker + person ending
  "ುವೆನು", "ುವೆವು", "ುವಿರಿ", "ುವನು", "ುವಳು", "ುವರು", "ುವುದು", "ುವೆ",
];

/**
 * Common irregular verbs: [conjugated-form prefix, dictionary root]. Only the past stem is
 * irregular for these; present/future forms are regular off the root and are already handled by
 * VERB_SUFFIXES. Every root here was confirmed present in public/data/dict/.
 */
const IRREGULAR_PAST_STEMS: ReadonlyArray<readonly [string, string]> = [
  ["ಹೋದ", "ಹೋಗು"], // go
  ["ಬಂದ", "ಬರು"], // come
  ["ಆದ", "ಆಗು"], // become/happen
  ["ಕೊಟ್ಟ", "ಕೊಡು"], // give
  ["ತಿಂದ", "ತಿನ್ನು"], // eat
  ["ನಿಂತ", "ನಿಲ್ಲು"], // stand/stop
];

function suffixStems(word: string, suffixes: readonly string[]): string[] {
  const stems: string[] = [];
  for (const suffix of suffixes) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 2) continue;
    const stem = word.slice(0, -suffix.length);
    stems.push(stem, `${stem}ು`, `${stem}ೆ`);
  }
  return stems;
}

/**
 * All candidate dictionary-root stems for a word: case-suffix stripping, regular verb
 * tense-suffix stripping, and the irregular-verb table. Order is not significant to callers —
 * they de-duplicate and check membership, not rank by position.
 */
export function inflectionStems(word: string): string[] {
  const stems = [...suffixStems(word, CASE_SUFFIXES), ...suffixStems(word, VERB_SUFFIXES)];
  for (const [prefix, root] of IRREGULAR_PAST_STEMS) {
    if (word.startsWith(prefix) && word.length > prefix.length) stems.push(root);
  }
  return [...new Set(stems)];
}
