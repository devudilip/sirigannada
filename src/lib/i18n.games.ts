import type { Locale } from "./types";

/** Strings for the /games hub and the daily-puzzle chrome (G-01..G-03). */
export const gamesStrings = {
  navGames: { kn: "ಆಟಗಳು", en: "Games" },
  gamesTitle: { kn: "ಆಟಗಳು", en: "Games" },
  gamesSub: { kn: "ಇಂದಿನ ಪದ, ಪದಬಂಧ ಮತ್ತು ಗಾದೆ ಪೂರ್ಣ. ದಿನಕ್ಕೊಂದು, ಎಲ್ಲರಿಗೂ ಒಂದೇ; ನಾಳೆ ಹೊಸದು. ಆಫ್‌ಲೈನ್.", en: "Daily word, Kannada crossword and Finish the proverb. One shared puzzle a day, a new one tomorrow. Offline." },
  gadeTitle: { kn: "ಗಾದೆ ಪೂರ್ಣ", en: "Finish the proverb" },
  gadeSub: { kn: "ಪದಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸಿ ಇಂದಿನ ಗಾದೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. 3 ಪ್ರಯತ್ನಗಳು.", en: "Put the words in order to finish today's proverb. 3 tries." },
  gadeHowTo: { kn: "ಪದಗಳನ್ನು ಕ್ರಮವಾಗಿ ಒತ್ತಿ. ಒಂದು ಪದ ಹೆಚ್ಚುವರಿ — ಅದನ್ನು ಬಿಡಿ.", en: "Tap the words in order. One word doesn't belong — leave it out." },
  gadeTiles: { kn: "ಪದಗಳು", en: "Word tiles" },
  gadeSlot: { kn: "{n}ನೇ ಸ್ಥಳ", en: "Blank {n}" },
  gadeCheck: { kn: "ಪರಿಶೀಲಿಸಿ", en: "Check" },
  gadeClear: { kn: "ತೆರವುಗೊಳಿಸಿ", en: "Clear" },
  gadeTriesLeft: { kn: "ಇನ್ನೂ {n} ಪ್ರಯತ್ನ ಉಳಿದಿದೆ", en: "{n} tries left" },
  gadeMissHint: { kn: "ಇನ್ನೂ ಸರಿಯಾಗಿಲ್ಲ. ಸರಿಯಾದ ಸ್ಥಳದಲ್ಲಿರುವ ಪದಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ; ಉಳಿದವನ್ನು ಜೋಡಿಸಿ.", en: "Not yet. Words in the right place stay put; arrange the rest." },
  gadeWon: { kn: "ಅಭಿನಂದನೆಗಳು! ಗಾದೆ ಪೂರ್ಣವಾಯಿತು.", en: "Well done — you finished it!" },
  gadeLost: { kn: "ಈ ಬಾರಿ ಆಗಲಿಲ್ಲ. ಇಂದಿನ ಗಾದೆ:", en: "Not this time. Today's proverb:" },
  gadeAllProverbs: { kn: "ಎಲ್ಲ ಗಾದೆಗಳು", en: "All proverbs" },
  gadeCredit: { kn: "ಗಾದೆಗಳು: ಕನ್ನಡ ವಿಕಿಕೋಟ್, CC BY-SA 4.0", en: "Proverbs: Kannada Wikiquote, CC BY-SA 4.0" },
  gamesWordSub: { kn: "ಇಂದಿನ ಪರಿಚಿತ ಕನ್ನಡ ಪದವನ್ನು 6 ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಊಹಿಸಿ.", en: "Guess today's familiar Kannada word in 6 tries." },
  gameDailyLabel: { kn: "ಇಂದಿನ ಆಟ", en: "Today's puzzle" },
  padabandhaComeBackTomorrow: { kn: "ನಾಳೆ ಹೊಸ ಪದಬಂಧ ಬರುತ್ತದೆ.", en: "A new crossword arrives tomorrow." },
  padabandhaAlarClue: { kn: "ಅಲರ್ ನಿಘಂಟಿನ ಅರ್ಥ", en: "Alar dictionary definition" },
  padabandhaAlarCredit: { kn: "ಕೆಲವು ಸುಳಿವುಗಳು ಅಲರ್ ನಿಘಂಟಿನ ಅರ್ಥಗಳು (ವಿ. ಕೃಷ್ಣ, ODbL 1.0).", en: "Some clues are Alar dictionary definitions (V. Krishna, ODbL 1.0)." },
  padabandhaLoadError: { kn: "ಪದಬಂಧಗಳು ಲೋಡ್ ಆಗಲಿಲ್ಲ; ಮೊದಲ ಪದಬಂಧ ಮಾತ್ರ ಲಭ್ಯ.", en: "Could not load the puzzle set; only the first crossword is available." },
  gamesMovedNote: { kn: "ಆಟಗಳು ಈಗ ‘ಆಟಗಳು’ ವಿಭಾಗದಲ್ಲಿವೆ.", en: "Games now live under Games." },
  aboutLinkSub: { kn: "ಯೋಜನೆ, ಪರವಾನಗಿ, ಮತ್ತು ಸಂಪರ್ಕ.", en: "The project, its licences, and how to reach us." },
} as const satisfies Record<string, Record<Locale, string>>;
