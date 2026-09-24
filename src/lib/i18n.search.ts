import type { Locale } from "./types";

/** Strings added by the UX-06 redesign (GH issue #79) for the search screens. */
export const searchStrings = {
  // Dictionary
  dictRelated: { kn: "ಸಂಬಂಧಿತ", en: "Related" },
  dictWhyMatched: { kn: "ಏಕೆ ಹೊಂದಿತು", en: "Why it matched" },
  dictCite: { kn: "ಉಲ್ಲೇಖ", en: "Cite" },
  dictSourceLine: { kn: "ಅಲರ್ · ವಿ. ಕೃಷ್ಣ · ODbL", en: "Alar · V. Krishna · ODbL" },
  dictExpandEntry: { kn: "{word} ಅರ್ಥ ತೋರಿಸಿ", en: "Show meaning of {word}" },
  dictClearHistory: { kn: "ಅಳಿಸಿ", en: "Clear" },
  // Proverbs
  proverbQuickSearches: { kn: "ತ್ವರಿತ ಹುಡುಕಾಟ", en: "Quick searches" },
  proverbGroupShowing: { kn: "{count} · {shown} ಕಾಣಿಸುತ್ತಿವೆ", en: "{count} · showing {shown}" },
  proverbSave: { kn: "ಉಳಿಸಿ", en: "Save" },
  proverbShare: { kn: "ಹಂಚಿ", en: "Share" },
  proverbCopy: { kn: "ನಕಲಿಸಿ", en: "Copy" },
  proverbWords: { kn: "ಪದಗಳು", en: "Words" },
  proverbLetterIndex: { kn: "ಅಕ್ಷರ ಸೂಚಿ", en: "Letter index" },
  proverbAllLetters: { kn: "ಎಲ್ಲ", en: "All" },
  proverbLetterCount: { kn: "{letter} · {count} ಗಾದೆಗಳು", en: "{letter} · {count} proverbs" },
  proverbShowMoreCount: { kn: "ಇನ್ನೂ {count} ತೋರಿಸಿ", en: "Show {count} more" },
  // Reader context lens
  lensBestGuess: { kn: "ಊಹೆ", en: "Best guess" },
  lensNotSure: { kn: "ಖಚಿತವಿಲ್ಲವೇ? {word} ನೋಡಿ", en: "Not sure? see {word}" },
  lensFullEntry: { kn: "ಪೂರ್ಣ ನಮೂದು", en: "Full entry" },
  // Full-corpus search (B-05, GH #43)
  corpusSearchTitle: { kn: "ಪುಸ್ತಕಗಳಲ್ಲಿ ಹುಡುಕಿ", en: "Search the books" },
  corpusSearchSub: { kn: "ಗ್ರಂಥಾಲಯದ ಎಲ್ಲ ಪುಸ್ತಕಗಳ ಪಠ್ಯದಲ್ಲಿ ಪದ ಹುಡುಕಿ", en: "Find a word in the text of every book in the library" },
  corpusSearchPlaceholder: { kn: "ಪದ ಹುಡುಕಿ…", en: "Search a word…" },
  corpusSearchHint: { kn: "ಪದದ ಮೊದಲ ಭಾಗ ಸಾಕು: ಮನೆ ಎಂದರೆ ಮನೆಯಲ್ಲಿ, ಮನೆಗೆ ಕೂಡ ಸಿಗುತ್ತವೆ", en: "The start of a word is enough: ಮನೆ also finds ಮನೆಯಲ್ಲಿ and ಮನೆಗೆ" },
  corpusSearchCount: { kn: "{books} ಪುಸ್ತಕಗಳಲ್ಲಿ {n} ಫಲಿತಾಂಶಗಳು", en: "{n} results in {books} books" },
  corpusSearchNoResults: { kn: "ಯಾವ ಪುಸ್ತಕದಲ್ಲೂ ಸಿಗಲಿಲ್ಲ", en: "Not found in any book" },
  corpusSearchLoading: { kn: "ಹುಡುಕಾಟ ಸೂಚಿ ತೆರೆಯುತ್ತಿದೆ…", en: "Opening the search index…" },
  corpusSearchUnavailable: { kn: "ಹುಡುಕಾಟ ಸೂಚಿ ಸಿಗಲಿಲ್ಲ. ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಒಮ್ಮೆ ತೆರೆಯಿರಿ.", en: "The search index did not load. Open this page once while online." },
  corpusSearchMatches: { kn: "{n} ಫಲಿತಾಂಶಗಳು", en: "{n} results" },
  corpusSearchShowMatches: { kn: "{title}: ಫಲಿತಾಂಶಗಳನ್ನು ತೋರಿಸಿ", en: "Show results in {title}" },
  corpusSearchBookOffline: { kn: "ಈ ಪುಸ್ತಕ ಇನ್ನೂ ಸಾಧನದಲ್ಲಿಲ್ಲ. ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ.", en: "This book is not on your device yet. Open it while online." },
  corpusSearchLibraryLink: { kn: "ಎಲ್ಲ ಪುಸ್ತಕಗಳಲ್ಲಿ ಪದ ಹುಡುಕಿ", en: "Search inside every book" },
} as const satisfies Record<string, Record<Locale, string>>;
