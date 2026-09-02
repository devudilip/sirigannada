/**
 * Hand-curated word lists for the "word of the day" picker (roadmap D-02).
 *
 * The heuristics in `dailyFilters.ts` catch shapes (Old-Kannada spellings, scholarly
 * glosses, truncated headwords). They cannot judge whether a well-formed word is one
 * an ordinary reader knows. These two lists are that judgement, made by hand.
 *
 * DENIED  — rare tatsamas, poetic synonyms and Old-Kannada nouns that survive every
 *           heuristic and won a window in an earlier build of `daily.json`.
 * ALLOWED — everyday words that must appear in the 366 even if a rarer word would
 *           otherwise win their alphabet window (ಹೂವು, ಪುಸ್ತಕ, ಸೂರ್ಯ and their class).
 *           An allow-listed word overrides every filter except the D-01 truncated
 *           headword check, so keep the list short and obviously ordinary.
 *
 * Words are whitespace-separated so the file stays under the 250-line limit; the two
 * lists must not overlap (`dailyWordLists.test.ts` enforces that).
 */

const DENIED = `
  ವಾಜಿ ವತ್ಸ ಫಣಿ ಕ್ಷಿತಿ ಅಂಶು ಅಶ್ರು ಪಸು ಪೊಡೆ ನಲ್ಮೆ ಒಸಗೆ ಇಂಬು ತೊತ್ತು ವಾರಿ ಉದಕ ನೇತ್ರ ಅಕ್ಷಿ ಚಕ್ಷು
  ಅಶ್ವ ತುರಗ ಅಂಬು ಕ್ಷೀರ ತೋಯ ಮೃಗ ಶಶಿ ಧರೆ ಮಹೀ ತನುಜ ಪಯ ಶಾರ್ದೂಲ ಸಿಂಧು ಗಜೇಂದ್ರ

  ಅಂಬೆ ಅಗಡು ಅಡ್ಡೆ ಅಣೆ ಅಣ್ಣೆ ಅದ್ದ ಅನಾದಿ ಅನುಕ ಅನ್ನೆ ಅಪಾಂಗ ಅಮಾನ ಅಮಾನಿ ಅರ್ತಿ ಅರ್ಥಿ ಅಲಿ ಅವನಿ
  ಅಸ್ತ ಅಸ್ತಿ ಅಹಂ ಆಮು ಆಯು ಆರ್ತ ಆಶು ಇತಿ ಉಡೆ ಉತ್ಕ ಉದ್ಘ ಉದ್ದಿ ಉಪಲ ಉರುಳಿ ಉರ್ವ ಊರೆ ಎಕ್ಕೆ

  ಕಡುಗ ಕರಕ ಕರ್ಕ ಕರ್ಪು ಕಲಂ ಕಸೆ ಕಾಕು ಕಾಶಿ ಕುಂಚಿ ಕುಂಭಿ ಕುರ ಕೂಚು ಕೂರಿ ಕೆಂಕ ಕೆಳೆ ಕೇಳಿ ಕೈದು
  ಕ್ರೀ ಖಂಡಿ ಖಾಸ ಖೋಡಿ ಗದಿ ಗರುಡಿ ಗುಗ್ಗು ಗುಜ್ಜು ಘಟಿ ಚಕ್ಕು ಚರಿ ಚಾಟು ಚಾರು ಚಿಟ್ಟು ಚುಂಚು

  ಜಂಗು ಜನ್ನ ಜಾನ ಜುಂಜು ಟಂಕ ಡಂಗು ತಂಬು ತಪ್ಪ ತಿರ ತೊಂಡು ದಂಡಿ ದರಿ ದಿಂಡು ದುಹಿ ದ್ವಿಗು ಧೃತಿ
  ನಸೆ ನಟ್ಟು ನಾರ ನಿರ್ಗ ನಿರ್ಗುಣ ನಿಶಿ

  ಪನ್ನೆ ಪತ್ರಿ ಪರಸ ಪರೆ ಪರ್ಣ ಪಾಂಡು ಪಾಣಿ ಪಿಂಗ ಪಿಂಜ ಪುಳಿ ಪುಸ್ತ ಪೊಡರ್ಪು ಬಂಡು ಬಾಕು ಬಾಹು ಬೇಳು
  ಭವಿ ಮಚ್ಚು ಮಾನಿ ಯೋನಿ ರಾವು ಲಾವ ಲೊಟ ವರಾಹ ವಾರು ವಿದ ವಿನ್ನ ವಿಶ ವೀಚು ವೇಣು ಶೈಲ ಸಂವ ಸೂರೆ
  ಸೊಂಪು ಸ್ವ ಹರೆ ಹೆರೆ

  ಅಣ್ಮು ಅನುಗ ಅಬ್ಜ ಅರ್ಕ ಅಸ್ಥಿ ಅಳ್ಳೆ ಆನು ಉತ್ತ ಉನ್ನ ಉಭಯ ಎಣೆ ಕಾಲಂ ಕುಂಜ ಕುಲಿ ಕೆರ ಕ್ಷ್ಮಾ
  ಗದಗು ಗಾರು ಗಿಡಿ ಗೆಡೆ ಗೋಳಿ ಚಂಗ ಚೈತ ಜೋಗು ಠಕ್ಕು ತೊಂಡ ತೋರ ದಾರೆ ದ್ಯುತಿ ನಾಲ ನೀಟು ಪದಿ
  ಪನ್ನ ಪರ್ಯ ಪಳೆ ಪಾಟ ಪಿರಿ ಬೇಹು ಮಗ್ಗು ವ್ಯಗ್ರ ಶಾಲಿ ಸಂಪಾದ ಸಾನು ಸೆಜ್ಜೆ

  ಅನಿಮಿಷ ಅಸಿತ ಆಂಕೆ ಉತ್ಸ ಉಪರಿ ಊಳಿ ಕವಡು ಕೈಪೆ ಗನೆ ಗೀಜು ಗುದಿ ಚಂಡ ಚಿಲಿ ತಡಿ ದಡಿ ದಧಿ ದುರ
  ನಂಬಿ ನಿಟ್ಟು ನೇರ್ಪು ಪನಿ ಪರಾರ್ಥ ಪರಿತ ಪೀತ ಬಣ್ಣಿಗೆ ಬಾದು ಸರಸಿ ಸುಂದ ಸೇದೆ ಸೋಡ

  ಅಳವು ಕೈನೆ ಖೋಡಾಸು ಚಾಕ ತರಿ ತಾರು ದೂಸ ನಂದ ನಿಮಿ ನಿರಾಸ ಸುಮ
  ಆಂತರಿ ಕೊಂಕ ಗಂಟೊಡೆ ತತ್ತ ದೂವೆ ನನ್ನಿ ನಿರವ ಸೂಕ
  ಕುಂಡ ಕೊಂಗ ಕೊಂಡೆ ಗಂಡಾಡು ಗಂಡೆಸೆ ಗಂಡೇಳು ಚಂಡಿ ಜಂಬು ಜಕ್ಕು ಪರಂಗಿ ಬೇಗು ಶೀಟು ಸುತ್ತಿ ಸೂತಿ ಸೂರಿ ಸೂಳು ಗದುಬು ಖೇದಿಸು
`;

const ALLOWED = `
  ಹೂವು ಪುಸ್ತಕ ಸೂರ್ಯ ಚಂದ್ರ ನಕ್ಷತ್ರ ಆಕಾಶ ಮಳೆ ಗಾಳಿ ಬೆಂಕಿ ಸಮುದ್ರ ನದಿ ಬೆಟ್ಟ
  ಮರ ಗಿಡ ಹಣ್ಣು ತರಕಾರಿ ಬೆಳ್ಳುಳ್ಳಿ ಈರುಳ್ಳಿ
  ನಾಯಿ ಬೆಕ್ಕು ಆಕಳು ಕುದುರೆ ಹಕ್ಕಿ ಹಾವು ಇಲಿ ಮೊಟ್ಟೆ
  ಬಾಗಿಲು ಕಿಟಕಿ ಕುರ್ಚಿ ಮೇಜು ದೀಪ ಕನ್ನಡಿ ಗಡಿಯಾರ ಬಟ್ಟೆ ಕಾಗದ ಬಣ್ಣ ಚಿತ್ರ
  ಊಟ ಅನ್ನ ರೊಟ್ಟಿ ಹಣ ಅಂಗಡಿ ರಸ್ತೆ ಬಸ್ಸು ರೈಲು ಆಸ್ಪತ್ರೆ ಔಷಧ ಶಾಲೆ ಶಿಕ್ಷಕ ವಿದ್ಯಾರ್ಥಿ
  ಅಪ್ಪ ಅಮ್ಮ ಅಕ್ಕ ಅಣ್ಣ ತಂಗಿ ತಮ್ಮ ಮಗು ಗೆಳೆಯ ಹೆಸರು ದೇಶ
  ರಾತ್ರಿ ದಿನ ವಾರ ತಿಂಗಳು ವರ್ಷ ಸಮಯ ಹಬ್ಬ ಆಟ ಕೆಲಸ ಸಂಗೀತ ಹಾಡು ಕಥೆ ಕನಸು ನಗು ಪ್ರೀತಿ
`;

function toSet(block: string): ReadonlySet<string> {
  return new Set(block.split(/\s+/).filter((w) => w !== ""));
}

export const DENIED_HEADWORDS: ReadonlySet<string> = toSet(DENIED);
export const ALLOWED_HEADWORDS: ReadonlySet<string> = toSet(ALLOWED);
/** Sorted copy, for tests and build-log reporting. */
export const ALLOWED_HEADWORD_LIST: readonly string[] = [...ALLOWED_HEADWORDS].sort();
