import type { Locale } from "./types";

/** Strings for the /games hub and the daily-puzzle chrome (G-01..G-03). */
export const gamesStrings = {
  navGames: { kn: "ಆಟಗಳು", en: "Games" },
  gamesTitle: { kn: "ಆಟಗಳು", en: "Games" },
  gamesSub: { kn: "ಇಂದಿನ ಪದ ಮತ್ತು ಪದಬಂಧ. ದಿನಕ್ಕೊಂದು, ಎಲ್ಲರಿಗೂ ಒಂದೇ; ನಾಳೆ ಹೊಸದು. ಆಫ್‌ಲೈನ್.", en: "Daily word and Kannada crossword. One shared puzzle a day, a new one tomorrow. Offline." },
  gamesWordSub: { kn: "ಇಂದಿನ ಪರಿಚಿತ ಕನ್ನಡ ಪದವನ್ನು 6 ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಊಹಿಸಿ.", en: "Guess today's familiar Kannada word in 6 tries." },
  gameDailyLabel: { kn: "ಇಂದಿನ ಆಟ", en: "Today's puzzle" },
  padabandhaComeBackTomorrow: { kn: "ನಾಳೆ ಹೊಸ ಪದಬಂಧ ಬರುತ್ತದೆ.", en: "A new crossword arrives tomorrow." },
  padabandhaAlarClue: { kn: "ಅಲರ್ ನಿಘಂಟಿನ ಅರ್ಥ", en: "Alar dictionary definition" },
  padabandhaAlarCredit: { kn: "ಕೆಲವು ಸುಳಿವುಗಳು ಅಲರ್ ನಿಘಂಟಿನ ಅರ್ಥಗಳು (ವಿ. ಕೃಷ್ಣ, ODbL 1.0).", en: "Some clues are Alar dictionary definitions (V. Krishna, ODbL 1.0)." },
  padabandhaLoadError: { kn: "ಪದಬಂಧಗಳು ಲೋಡ್ ಆಗಲಿಲ್ಲ; ಮೊದಲ ಪದಬಂಧ ಮಾತ್ರ ಲಭ್ಯ.", en: "Could not load the puzzle set; only the first crossword is available." },
  gamesMovedNote: { kn: "ಆಟಗಳು ಈಗ ‘ಆಟಗಳು’ ವಿಭಾಗದಲ್ಲಿವೆ.", en: "Games now live under Games." },
  aboutLinkSub: { kn: "ಯೋಜನೆ, ಪರವಾನಗಿ, ಮತ್ತು ಸಂಪರ್ಕ.", en: "The project, its licences, and how to reach us." },
} as const satisfies Record<string, Record<Locale, string>>;
