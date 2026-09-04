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
 * Tense/person suffixes for regular verbs. Roots in Alar ending in ಉ (ಮಾಡು, ನೋಡು) take an
 * inserted ಿ before the past marker ದ (ಮಾಡ್+ಿದನು = ಮಾಡಿದನು) — strip PAST_I_SUFFIXES and re-add
 * ಉ to recover them. Roots already ending in ಇ or ಎ (ಕುಡಿ, ಬರೆ) take ದ directly with no
 * inserted vowel (ಕುಡಿ+ದನು = ಕುಡಿದನು, ಬರೆ+ದನು = ಬರೆದನು) — strip PAST_PLAIN_SUFFIXES with no
 * reconstruction. A word ending in ಿದ<person> is genuinely ambiguous between these two (the
 * surface ಿ may be the inserted marker or the root's own final vowel) — `pastStems` returns both
 * candidates for that case, ಉ-reconstruction first since ಉ-ending roots are the larger class in
 * Alar. This is a heuristic, not a real disambiguation: if the ಉ-reconstructed spelling also
 * happens to be an unrelated real headword (ಕುಡಿದನು "he drank" → ಕುಡು "give/hit" also exists,
 * not just ಕುಡಿ "drink"), the wrong one wins. Known limitation, not fixable by suffix rules
 * alone — would need a verb-root lexicon or POS-aware ranking.
 */
const PAST_I_SUFFIXES = ["ಿದೆನು", "ಿದೆವು", "ಿದಿರಿ", "ಿದನು", "ಿದಳು", "ಿದರು", "ಿದವು", "ಿದೆ", "ಿತು", "ಿದ"];
const PAST_PLAIN_SUFFIXES = ["ದೆನು", "ದೆವು", "ದಿರಿ", "ದನು", "ದಳು", "ದರು", "ದವು", "ದೆ", "ತು", "ದ"];

const PRESENT_FUTURE_SUFFIXES = [
  // Present / habitual: ುತ್ತ marker + person ending
  "ುತ್ತೇನೆ", "ುತ್ತೇವೆ", "ುತ್ತೀಯ", "ುತ್ತೀರಿ", "ುತ್ತಾನೆ", "ುತ್ತಾಳೆ", "ುತ್ತಾರೆ", "ುತ್ತದೆ", "ುತ್ತವೆ",
  // Future: ುವ marker + person ending
  "ುವೆನು", "ುವೆವು", "ುವಿರಿ", "ುವನು", "ುವಳು", "ುವರು", "ುವುದು", "ುವೆ",
];

function pastStems(word: string): string[] {
  for (const suffix of PAST_I_SUFFIXES) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 2) continue;
    const plainSuffix = suffix.slice(1); // same person ending, without the leading ಿ
    return [`${word.slice(0, -suffix.length)}ು`, word.slice(0, -plainSuffix.length)];
  }
  for (const suffix of PAST_PLAIN_SUFFIXES) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 2) continue;
    return [word.slice(0, -suffix.length)];
  }
  return [];
}

/**
 * Common irregular verbs: [conjugated-form prefix, dictionary root]. Only the past stem is
 * irregular for these; present/future forms are regular off the root and are already handled by
 * PRESENT_FUTURE_SUFFIXES. Every root here was confirmed present in public/data/dict/.
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
 * Verb stems only try the reconstructed ಉ/ೆ root, never the bare truncated stem: a bare stem
 * like ಮಾಡ (from ಮಾಡಿದನು) is frequently itself an unrelated real headword ("a storey/building",
 * not "did"), and callers such as lookupInflected pick the *first* match as a pinned single
 * answer, so a spurious bare-stem hit before the real root is a wrong-answer bug, not noise.
 */
function verbStems(word: string): string[] {
  const stems = pastStems(word);
  for (const suffix of PRESENT_FUTURE_SUFFIXES) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 2) continue;
    stems.push(`${word.slice(0, -suffix.length)}ು`);
  }
  return stems;
}

/**
 * All candidate dictionary-root stems for a word: case-suffix stripping, regular verb
 * tense-suffix stripping, and the irregular-verb table. Order matters — callers such as
 * lookupInflected take the first match as the single pinned answer, so more reliable candidates
 * (irregular-table roots, reconstructed verb roots) are listed before noisier ones (bare
 * case-suffix stems, which can themselves be unrelated real headwords).
 */
export function inflectionStems(word: string): string[] {
  const stems: string[] = [];
  for (const [prefix, root] of IRREGULAR_PAST_STEMS) {
    if (word.startsWith(prefix) && word.length > prefix.length) stems.push(root);
  }
  stems.push(...verbStems(word), ...suffixStems(word, CASE_SUFFIXES));
  return [...new Set(stems)];
}
