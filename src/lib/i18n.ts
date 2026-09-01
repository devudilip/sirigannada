import type { Locale } from "./types";

/**
 * All user-visible strings. Kannada first, English second.
 * Add a key here, then use `t("key")` from `useT()` in components.
 */
export const strings = {
  appName: { kn: "ಸಿರಿಗನ್ನಡ", en: "Sirigannada" },
  tagline: { kn: "ಕನ್ನಡಕ್ಕೆ ಒಂದೇ ನೆಲೆ", en: "One home for Kannada" },
  navHome: { kn: "ಮುಖಪುಟ", en: "Home" },
  navDictionary: { kn: "ನಿಘಂಟು", en: "Dictionary" },
  navLibrary: { kn: "ಗ್ರಂಥಾಲಯ", en: "Library" },
  navAbout: { kn: "ಕುರಿತು", en: "About" },
  searchPlaceholder: { kn: "ಪದ ಹುಡುಕಿ…", en: "Search a word…" },
  searchHint: { kn: "ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ", en: "Type in Kannada or English letters" },
  noResults: { kn: "ಯಾವುದೇ ಪದ ಸಿಗಲಿಲ್ಲ", en: "No words found" },
  wordOfDay: { kn: "ಇಂದಿನ ಪದ", en: "Word of the day" },
  results: { kn: "ಫಲಿತಾಂಶಗಳು", en: "Results" },
  loading: { kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…", en: "Loading…" },
  openBook: { kn: "ಓದಿ", en: "Read" },
  chapters: { kn: "ಅಧ್ಯಾಯಗಳು", en: "Chapters" },
  fontSize: { kn: "ಅಕ್ಷರ ಗಾತ್ರ", en: "Font size" },
  paper: { kn: "ಕಾಗದ", en: "Paper" },
  paperLight: { kn: "ಬಿಳಿ", en: "Light" },
  paperSepia: { kn: "ಹಳದಿ", en: "Sepia" },
  paperNight: { kn: "ರಾತ್ರಿ", en: "Night" },
  bookmark: { kn: "ಗುರುತು", en: "Bookmark" },
  nextPage: { kn: "ಮುಂದಿನ ಪುಟ", en: "Next page" },
  prevPage: { kn: "ಹಿಂದಿನ ಪುಟ", en: "Previous page" },
  pageOf: { kn: "ಪುಟ {n} / {total}", en: "Page {n} of {total}" },
  lookUp: { kn: "ಅರ್ಥ ನೋಡಿ", en: "Look up" },
  close: { kn: "ಮುಚ್ಚಿ", en: "Close" },
  theme: { kn: "ಬಣ್ಣ", en: "Theme" },
  language: { kn: "English", en: "ಕನ್ನಡ" },
  source: { kn: "ಮೂಲ", en: "Source" },
  license: { kn: "ಪರವಾನಗಿ", en: "License" },
  copyCitation: { kn: "ಉಲ್ಲೇಖ ನಕಲಿಸಿ", en: "Copy citation" },
  copied: { kn: "ನಕಲಾಯಿತು", en: "Copied" },
  offlineReady: { kn: "ಈಗ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಬಳಸಬಹುದು", en: "Ready to use offline" },
  dictCredit: { kn: "ವಿ. ಕೃಷ್ಣ ಅವರ ಅಲರ್ ನಿಘಂಟು (ODbL)", en: "Alar dictionary by V. Krishna (ODbL)" },
  heroTitle: { kn: "ಕನ್ನಡದ ಪದ, ಕಾವ್ಯ, ಜ್ಞಾನ — ಒಂದೇ ಕಡೆ.", en: "Kannada words, poetry, knowledge — in one place." },
  heroBody: {
    kn: "ಒಂದೂವರೆ ಲಕ್ಷ ಪದಗಳ ನಿಘಂಟು ಮತ್ತು ಶತಮಾನಗಳ ಸಾಹಿತ್ಯ. ಮುಕ್ತ, ಉಚಿತ, ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಲಭ್ಯ.",
    en: "A 150,000-word dictionary and centuries of literature. Open, free, and available offline.",
  },
  shelfTitle: { kn: "ಪುಸ್ತಕದ ಕಪಾಟು", en: "Bookshelf" },
  installApp: { kn: "ಆ್ಯಪ್ ಆಗಿ ಸೇರಿಸಿ", en: "Install app" },
} as const satisfies Record<string, Record<Locale, string>>;

export type StringKey = keyof typeof strings;

export function translate(locale: Locale, key: StringKey, vars?: Record<string, string | number>): string {
  let out: string = strings[key][locale];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}
