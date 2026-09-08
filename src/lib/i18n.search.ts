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
  proverbShowMoreCount: { kn: "ಇನ್ನೂ {count} ತೋರಿಸಿ", en: "Show {count} more" },
  // Reader context lens
  lensBestGuess: { kn: "ಊಹೆ", en: "Best guess" },
  lensNotSure: { kn: "ಖಚಿತವಿಲ್ಲವೇ? {word} ನೋಡಿ", en: "Not sure? see {word}" },
  lensFullEntry: { kn: "ಪೂರ್ಣ ನಮೂದು", en: "Full entry" },
} as const satisfies Record<string, Record<Locale, string>>;
