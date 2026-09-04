import type { Locale } from "./types";

/**
 * Part-of-speech display labels, kept in their own module so `i18n.ts` stays
 * under the file-size limit. Spread into `strings` in `i18n.ts` — always go
 * through `t("posNoun")` etc. from there, never import this file directly.
 */
export const posStrings = {
  posNoun: { kn: "ನಾಮಪದ", en: "noun" },
  posVerb: { kn: "ಕ್ರಿಯಾಪದ", en: "verb" },
  posAdjective: { kn: "ಗುಣವಾಚಕ", en: "adjective" },
  posAdverb: { kn: "ಕ್ರಿಯಾವಿಶೇಷಣ", en: "adverb" },
  posPronoun: { kn: "ಸರ್ವನಾಮ", en: "pronoun" },
  posConjunction: { kn: "ಸಂಯೋಜಕ", en: "conjunction" },
  posInterjection: { kn: "ಭಾವಸೂಚಕ", en: "interjection" },
  posPreposition: { kn: "ಉಪಸರ್ಗ", en: "preposition" },
  posPrefix: { kn: "ಪೂರ್ವಪ್ರತ್ಯಯ", en: "prefix" },
  posSuffix: { kn: "ಪ್ರತ್ಯಯ", en: "suffix" },
  posOther: { kn: "", en: "" },
} as const satisfies Record<string, Record<Locale, string>>;
