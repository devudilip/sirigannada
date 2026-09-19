import type { Locale } from "./types";

/** Strings added by the UX-06 redesign (GH issue #79) for the more screens. */
export const moreStrings = {
  moreMine: { kn: "ನನ್ನದು", en: "Mine" },
  moreTools: { kn: "ಉಪಕರಣಗಳು", en: "Tools" },
  moreFooter: { kn: "ಇತರ ಕೊಂಡಿಗಳು", en: "Other links" },

  // 1h Games hub
  gamesSamePuzzles: { kn: "ಎಲ್ಲರಿಗೂ ಒಂದೇ ಒಗಟುಗಳು", en: "same puzzles for everyone" },
  gamesPlay: { kn: "ಆಡಿ", en: "Play" },
  gamesResume: { kn: "ಮುಂದುವರಿಸಿ", en: "Resume" },
  gamesTomorrowNote: { kn: "ನಾಳೆ ಮಧ್ಯರಾತ್ರಿಗೆ ಹೊಸದು — ನಿಮ್ಮ ಸಮಯದಲ್ಲಿ.", en: "Tomorrow is new at midnight, your time." },
  gamesCrosswordPreview: { kn: "ಪದಬಂಧದ ಮಾದರಿ", en: "Crossword preview" },

  // 1i Word game
  wordGameDayKicker: { kn: "ಪದ · #{n} · {date}", en: "Word · #{n} · {date}" },
  wordGameLegend: { kn: "ಬಣ್ಣಗಳ ಅರ್ಥ", en: "Colour key" },
  kbdEnter: { kn: "ಸರಿ", en: "Enter" },

  // 1j Alphabet
  alphabetLetterCount: { kn: "{count} ಅಕ್ಷರಗಳು · ISO 15919", en: "{count} letters · ISO 15919" },

  // 1k More / 1l Offline
  offlineOnDevice: { kn: "ಸಾಧನದಲ್ಲಿ {size}", en: "{size} on device" },
  offlineUsed: { kn: "{size} ಬಳಕೆ", en: "{size} used" },
  offlineStorageBreakdown: { kn: "ಸಂಗ್ರಹದ ವಿಂಗಡಣೆ", en: "Storage by category" },
  offlineClearAll: { kn: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ", en: "Clear all" },
  offlineClearAllConfirm: {
    kn: "ಈ ಸಾಧನದಲ್ಲಿರುವ ಎಲ್ಲಾ ಆಫ್‌ಲೈನ್ ಸಂಗ್ರಹವನ್ನು ಅಳಿಸಬೇಕೇ? ಮತ್ತೆ ಇಳಿಸಿಕೊಳ್ಳಬಹುದು.",
    en: "Clear all offline storage on this device? You can download it again later.",
  },
} as const satisfies Record<string, Record<Locale, string>>;
