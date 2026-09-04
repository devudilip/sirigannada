import type { Locale } from "./types";

/**
 * Strings for the reader's context lens (F-02): book-occurrence and matching-proverb sections
 * of the tap-to-lookup sheet, kept in their own module so `i18n.ts` stays under the file-size
 * limit. Spread into `strings` in `i18n.ts` — always go through `t("contextLensInBook")` etc.
 * from there, never import this file directly.
 */
export const contextLensStrings = {
  contextLensInBook: { kn: "ಈ ಪುಸ್ತಕದಲ್ಲಿ", en: "In this book" },
  contextLensScopeNote: {
    kn: "ಈ ಪುಸ್ತಕದಲ್ಲಿ ಮಾತ್ರ ಹುಡುಕಲಾಗಿದೆ, ಇಡೀ ಗ್ರಂಥಾಲಯದಲ್ಲಿ ಅಲ್ಲ.",
    en: "Searched only in this book, not the whole library.",
  },
  contextLensNoOccurrences: { kn: "ಈ ಪುಸ್ತಕದಲ್ಲಿ ಬೇರೆಡೆ ಕಾಣಿಸುತ್ತಿಲ್ಲ.", en: "Doesn't appear elsewhere in this book." },
  contextLensMoreOccurrences: { kn: "+ ಇನ್ನೂ {count}", en: "+{count} more" },
  contextLensProverbs: { kn: "ಹೊಂದುವ ಗಾದೆಗಳು", en: "Matching proverbs" },
  contextLensNoProverbs: { kn: "ಹೊಂದುವ ಗಾದೆಗಳು ಸಿಗಲಿಲ್ಲ.", en: "No matching proverbs found." },
} as const satisfies Record<string, Record<Locale, string>>;
