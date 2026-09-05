import type { Locale } from "./types";

/** Strings for the /games hub and the shared daily/practice-round chrome (G-01..G-03). */
export const gamesStrings = {
  navGames: { kn: "ಆಟಗಳು", en: "Games" },
  gamesTitle: { kn: "ಆಟಗಳು", en: "Games" },
  gamesSub: { kn: "ಇಂದಿನ ಪದ ಮತ್ತು ಪದಬಂಧ. ದಿನಕ್ಕೊಂದು ಎಲ್ಲರಿಗೂ ಒಂದೇ; ಮುಗಿದ ಮೇಲೆ ಇನ್ನೊಂದು ಆಡಬಹುದು. ಆಫ್‌ಲೈನ್.", en: "Daily word and Kannada crossword. One shared puzzle a day, then play as many more as you like. Offline." },
  gamesWordSub: { kn: "ಇಂದಿನ ಪರಿಚಿತ ಕನ್ನಡ ಪದವನ್ನು 6 ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಊಹಿಸಿ.", en: "Guess today's familiar Kannada word in 6 tries." },
  gameDailyLabel: { kn: "ಇಂದಿನ ಆಟ", en: "Today's puzzle" },
  gamePracticeLabel: { kn: "ಅಭ್ಯಾಸ ಸುತ್ತು {n}", en: "Practice round {n}" },
  gameAnother: { kn: "ಇನ್ನೊಂದು ಆಡಿ", en: "Play another" },
  gameBackToDaily: { kn: "ಇಂದಿನ ಆಟಕ್ಕೆ ಹಿಂತಿರುಗಿ", en: "Back to today's puzzle" },
  gamePracticeNote: { kn: "ಇಂದಿನ ಆಟ ಎಲ್ಲರಿಗೂ ಒಂದೇ. ಅಭ್ಯಾಸ ಸುತ್ತುಗಳು ಈ ಸಾಧನದಲ್ಲಿ ಮಾತ್ರ, ಪುನರಾವರ್ತನೆ ಇಲ್ಲದೆ.", en: "Today's puzzle is the same for everyone. Practice rounds are on this device only, with no repeats." },
  padabandhaAlarClue: { kn: "ಅಲರ್ ನಿಘಂಟಿನ ಅರ್ಥ", en: "Alar dictionary definition" },
  padabandhaAlarCredit: { kn: "ಕೆಲವು ಸುಳಿವುಗಳು ಅಲರ್ ನಿಘಂಟಿನ ಅರ್ಥಗಳು (ವಿ. ಕೃಷ್ಣ, ODbL 1.0).", en: "Some clues are Alar dictionary definitions (V. Krishna, ODbL 1.0)." },
  padabandhaLoadError: { kn: "ಪದಬಂಧಗಳು ಲೋಡ್ ಆಗಲಿಲ್ಲ; ಮೊದಲ ಪದಬಂಧ ಮಾತ್ರ ಲಭ್ಯ.", en: "Could not load the puzzle set; only the first crossword is available." },
  gamesMovedNote: { kn: "ಆಟಗಳು ಈಗ ‘ಆಟಗಳು’ ವಿಭಾಗದಲ್ಲಿವೆ.", en: "Games now live under Games." },
  aboutLinkSub: { kn: "ಯೋಜನೆ, ಪರವಾನಗಿ, ಮತ್ತು ಸಂಪರ್ಕ.", en: "The project, its licences, and how to reach us." },
} as const satisfies Record<string, Record<Locale, string>>;
