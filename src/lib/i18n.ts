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
  translitIso: { kn: "ಲಿಪ್ಯಂತರ · ISO 15919", en: "Transliteration · ISO 15919" },
  alarPhone: { kn: "ಅಲರ್ ಉಚ್ಚಾರ", en: "Alar pronunciation" },
  wordOrigin: { kn: "ಪದದ ಮೂಲ", en: "Word origin" },
  results: { kn: "ಫಲಿತಾಂಶಗಳು", en: "Results" },
  loading: { kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…", en: "Loading…" },
  openBook: { kn: "ಓದಿ", en: "Read" },
  chapters: { kn: "ಅಧ್ಯಾಯಗಳು", en: "Chapters" },
  fontSize: { kn: "ಅಕ್ಷರ ಗಾತ್ರ", en: "Font size" },
  readerSettings: { kn: "ಓದುವಿಕೆ", en: "Reading" },
  lineHeight: { kn: "ಸಾಲಿನ ಅಂತರ", en: "Line height" },
  lineHeightTight: { kn: "ಕಿರಿದು", en: "Tight" },
  lineHeightNormal: { kn: "ಸಾಮಾನ್ಯ", en: "Normal" },
  lineHeightLoose: { kn: "ಸಡಿಲ", en: "Loose" },
  pageMargin: { kn: "ಅಂಚು", en: "Margin" },
  marginCompact: { kn: "ಕಿರಿದು", en: "Compact" },
  marginNormal: { kn: "ಸಾಮಾನ್ಯ", en: "Normal" },
  marginWide: { kn: "ಅಗಲ", en: "Wide" },
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
  copyLink: { kn: "ಕೊಂಡಿ ನಕಲಿಸಿ", en: "Copy link" },
  copied: { kn: "ನಕಲಾಯಿತು", en: "Copied" },
  verseLinkCopied: { kn: "ಪದ್ಯದ ಕೊಂಡಿ ನಕಲಾಯಿತು", en: "Verse link copied" },
  offlineReady: { kn: "ಈಗ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಬಳಸಬಹುದು", en: "Ready to use offline" },
  dictCredit: { kn: "ವಿ. ಕೃಷ್ಣ ಅವರ ಅಲರ್ ನಿಘಂಟು (ODbL)", en: "Alar dictionary by V. Krishna (ODbL)" },
  navCredits: { kn: "ಮೂಲಗಳು", en: "Credits" },
  creditsSub: {
    kn: "ಪ್ರತಿ ಪಠ್ಯದ ಲೇಖಕ, ನಿಧನ ವರ್ಷ, ಮೂಲ ಮತ್ತು ಪರವಾನಗಿ.",
    en: "Author, death year, source, and licence for every text.",
  },
  creditsBooks: { kn: "ಗ್ರಂಥಾಲಯದ ಪುಸ್ತಕಗಳು", en: "Books on the shelf" },
  creditsAlarTitle: { kn: "ನಿಘಂಟು", en: "Dictionary" },
  creditsAlarBody: {
    kn: "ಅಲರ್ ಕನ್ನಡ–ಇಂಗ್ಲಿಷ್ ನಿಘಂಟು © ವಿ. ಕೃಷ್ಣ. ಮುಕ್ತ ದತ್ತಸಂಚಯ ಪರವಾನಗಿ (ODbL 1.0). ಇಲ್ಲಿನ ನಿಘಂಟು ದತ್ತಾಂಶವೂ ODbL ಆಗಿಯೇ ಉಳಿಯುತ್ತದೆ.",
    en: "Alar Kannada–English dictionary © V. Krishna, Open Database License 1.0. Derived dictionary data remains ODbL.",
  },
  authorDied: { kn: "ನಿಧನ {year}", en: "died {year}" },
  licensePublicDomain: { kn: "ಸಾರ್ವಜನಿಕ ಸ್ವತ್ತು", en: "Public domain" },
  licenseCC0: { kn: "CC0 1.0", en: "CC0 1.0" },
  licenseCCBY: { kn: "CC BY 4.0", en: "CC BY 4.0" },
  licenseCCBYSA: { kn: "CC BY-SA 4.0", en: "CC BY-SA 4.0" },
  licenseODbL: { kn: "ODbL 1.0", en: "ODbL 1.0" },
  seeAllCredits: { kn: "ಎಲ್ಲ ಮೂಲಗಳು ಮತ್ತು ಪರವಾನಗಿಗಳು", en: "All sources and licences" },
  heroTitle: { kn: "ಕನ್ನಡದ ಪದ, ಕಾವ್ಯ, ಜ್ಞಾನ — ಒಂದೇ ಕಡೆ.", en: "Kannada words, poetry, knowledge — in one place." },
  heroBody: {
    kn: "ಒಂದೂವರೆ ಲಕ್ಷ ಪದಗಳ ನಿಘಂಟು ಮತ್ತು ಶತಮಾನಗಳ ಸಾಹಿತ್ಯ. ಮುಕ್ತ, ಉಚಿತ, ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಲಭ್ಯ.",
    en: "A 150,000-word dictionary and centuries of literature. Open, free, and available offline.",
  },
  continueReading: { kn: "ಓದುವುದನ್ನು ಮುಂದುವರಿಸಿ", en: "Continue reading" },
  continuePage: { kn: "ಪುಟ {n}", en: "page {n}" },
  shelfTitle: { kn: "ಪುಸ್ತಕದ ಕಪಾಟು", en: "Bookshelf" },
  installApp: { kn: "ಆ್ಯಪ್ ಆಗಿ ಸೇರಿಸಿ", en: "Install app" },
  recentSearches: { kn: "ಇತ್ತೀಚಿನ ಹುಡುಕಾಟ", en: "Recent searches" },
  favourites: { kn: "ಇಷ್ಟದ ಪದಗಳು", en: "Favourites" },
  clearHistory: { kn: "ಅಳಿಸಿ", en: "Clear" },
  starWord: { kn: "ಇಷ್ಟಪಟ್ಟಿಗೆ ಸೇರಿಸಿ", en: "Add to favourites" },
  unstarWord: { kn: "ಇಷ್ಟಪಟ್ಟಿಯಿಂದ ತೆಗೆಯಿರಿ", en: "Remove from favourites" },
  offlineBooksDownload: { kn: "ಎಲ್ಲ ಪುಸ್ತಕಗಳನ್ನು ಆಫ್‌ಲೈನ್‌ಗೆ ಇಳಿಸಿ", en: "Download all books for offline" },
  offlineBooksProgress: { kn: "{n} / {total}", en: "{n} of {total}" },
  offlineBooksDone: { kn: "ಎಲ್ಲ ಪುಸ್ತಕಗಳು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿವೆ", en: "All books are available offline" },
  offlineBooksPartial: {
    kn: "{count} ಪುಸ್ತಕ ಸಿಗಲಿಲ್ಲ: {names}",
    en: "{count} books failed: {names}",
  },
  offlineBooksUnavailable: {
    kn: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಆಫ್‌ಲೈನ್ ಇಳಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ",
    en: "Offline download is not available in this browser",
  },
  transliterateTitle: { kn: "ಲಿಪ್ಯಂತರ", en: "Transliteration" },
  transliterateSub: {
    kn: "ಕನ್ನಡ ಮತ್ತು ISO 15919 ಲ್ಯಾಟಿನ್ ಲಿಪಿಯ ನಡುವೆ ಪರಿವರ್ತಿಸಿ.",
    en: "Convert between Kannada and ISO 15919 Latin.",
  },
  latinToKannada: { kn: "ಲ್ಯಾಟಿನ್ → ಕನ್ನಡ", en: "Latin → Kannada" },
  kannadaToLatin: { kn: "ಕನ್ನಡ → ISO", en: "Kannada → ISO" },
  transliterateInput: { kn: "ಮೂಲ ಪಠ್ಯ", en: "Source text" },
  transliterateOutput: { kn: "ಪರಿವರ್ತಿತ ಪಠ್ಯ", en: "Transliterated text" },
  latinInputPlaceholder: { kn: "ಉದಾ. kannaḍa", en: "e.g. kannaḍa" },
  kannadaInputPlaceholder: { kn: "ಉದಾ. ಕನ್ನಡ", en: "e.g. ಕನ್ನಡ" },
  isoNote: {
    kn: "ಲ್ಯಾಟಿನ್ ಲಿಪಿಗೆ ISO 15919 ಮಾನಕವನ್ನು ಬಳಸಲಾಗಿದೆ.",
    en: "The Latin side uses the ISO 15919 standard.",
  },
  openTransliterator: { kn: "ಲಿಪ್ಯಂತರ ಸಲಕರಣೆ", en: "Transliteration tool" },
  numbersTitle: { kn: "ಅಂಕೆಗಳು", en: "Numbers" },
  numbersSub: {
    kn: "ಅರಬಿ ಮತ್ತು ಕನ್ನಡ ಅಂಕೆಗಳು, ಹಾಗೂ ಸಂಖ್ಯೆಯನ್ನು ಪದಗಳಲ್ಲಿ.",
    en: "Arabic and Kannada digits, and numbers in words.",
  },
  numbersInput: { kn: "ಸಂಖ್ಯೆ", en: "Number" },
  numbersPlaceholder: { kn: "ಉದಾ. ೧೨೦೦ ಅಥವಾ 1200", en: "e.g. ೧೨೦೦ or 1200" },
  numbersKannadaDigits: { kn: "ಕನ್ನಡ ಅಂಕೆಗಳು", en: "Kannada digits" },
  numbersArabicDigits: { kn: "ಅರಬಿ ಅಂಕೆಗಳು", en: "Arabic digits" },
  numbersWords: { kn: "ಪದಗಳಲ್ಲಿ", en: "In words" },
  numbersOutOfRange: {
    kn: "೦ ರಿಂದ ೧೦೦ ಕೋಟಿಯವರೆಗಿನ ಪೂರ್ಣಾಂಕವನ್ನು ನಮೂದಿಸಿ.",
    en: "Enter a whole number from 0 to 100 crore (10⁹).",
  },
  openNumbers: { kn: "ಅಂಕೆ ಸಲಕರಣೆ", en: "Numbers tool" },
} as const satisfies Record<string, Record<Locale, string>>;

export type StringKey = keyof typeof strings;

export function translate(locale: Locale, key: StringKey, vars?: Record<string, string | number>): string {
  let out: string = strings[key][locale];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}
