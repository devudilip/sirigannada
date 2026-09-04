import type { Locale } from "./types";

/**
 * Strings for the daily akshara-guess game (L-05), kept in their own module so `i18n.ts` stays
 * under the file-size limit. Spread into `strings` in `i18n.ts` — always go through
 * `t("wordGameTitle")` etc. from there, never import this file directly.
 */
export const wordGameStrings = {
  practiceModeWordGame: { kn: "ಪದ ಪಂದ್ಯ", en: "Word game" },
  practiceModeWordGameSub: { kn: "ಇಂದಿನ ಐದು-ಅಕ್ಷರದ ಪದವನ್ನು ಊಹಿಸಿ.", en: "Guess today's five-akshara word." },
  wordGameTitle: { kn: "ಪದ ಪಂದ್ಯ", en: "Word game" },
  wordGameInstructions: {
    kn: "5 ಅಕ್ಷರಗಳ ಕನ್ನಡ ಪದವನ್ನು 6 ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಊಹಿಸಿ.",
    en: "Guess the 5-akshara Kannada word in 6 tries.",
  },
  wordGameStatusCorrect: { kn: "ಸರಿಯಾದ ಸ್ಥಾನದಲ್ಲಿದೆ", en: "correct position" },
  wordGameStatusPresent: { kn: "ಪದದಲ್ಲಿದೆ, ಬೇರೆ ಸ್ಥಾನದಲ್ಲಿ", en: "in the word, wrong position" },
  wordGameStatusAbsent: { kn: "ಪದದಲ್ಲಿಲ್ಲ", en: "not in the word" },
  wordGameCellLabel: { kn: "{n}ನೇ ಅಕ್ಷರ: {status}", en: "akshara {n}: {status}" },
  wordGameSubmit: { kn: "ಊಹಿಸಿ", en: "Guess" },
  wordGameTooShort: { kn: "5 ಅಕ್ಷರಗಳ ಪದ ಬೇಕು", en: "Needs to be 5 aksharas" },
  wordGameNotInPool: { kn: "ಪದಕೋಶದಲ್ಲಿ ಇಲ್ಲದ ಪದ", en: "Not a word in the list" },
  wordGameWon: { kn: "ಅಭಿನಂದನೆಗಳು! ಸರಿಯಾಗಿ ಊಹಿಸಿದಿರಿ.", en: "Well done — you guessed it!" },
  wordGameLost: { kn: "ಈ ಬಾರಿ ಆಗಲಿಲ್ಲ.", en: "Not this time." },
  wordGameAnswerWas: { kn: "ಪದ: {word}", en: "The word was: {word}" },
  wordGameMeaning: { kn: "ಅರ್ಥ: {meaning}", en: "Meaning: {meaning}" },
  wordGameGuessCount: { kn: "ಪ್ರಯತ್ನ {n} / {total}", en: "Guess {n} of {total}" },
  wordGameComeBackTomorrow: { kn: "ನಾಳೆ ಹೊಸ ಪದ ಬರುತ್ತದೆ.", en: "A new word arrives tomorrow." },
  wordGameLoadError: { kn: "ಪದ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ", en: "Could not load the word list" },
} as const satisfies Record<string, Record<Locale, string>>;
