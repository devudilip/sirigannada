import type { Locale } from "./types";

/**
 * Strings for the daily akshara-guess game (L-05), kept in their own module so `i18n.ts` stays
 * under the file-size limit. Spread into `strings` in `i18n.ts` — always go through
 * `t("wordGameTitle")` etc. from there, never import this file directly.
 */
export const wordGameStrings = {
  practiceModeWordGame: { kn: "ಇಂದಿನ ಪದ", en: "Daily word" },
  practiceModeWordGameSub: { kn: "ಇಂದಿನ ಪರಿಚಿತ ಕನ್ನಡ ಪದವನ್ನು ಊಹಿಸಿ.", en: "Guess today's familiar Kannada word." },
  wordGameTitle: { kn: "ಇಂದಿನ ಪದ", en: "Daily word" },
  wordGameInstructions: {
    kn: "{count} ಅಕ್ಷರಗಳ ಪದವನ್ನು 6 ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಊಹಿಸಿ. ಒತ್ತಕ್ಷರ ಒಂದೇ ಚೌಕದಲ್ಲಿ ಬರುತ್ತದೆ.",
    en: "Guess the {count}-akshara Kannada word in 6 tries. A conjunct uses one square.",
  },
  wordGameStatusCorrect: { kn: "ಸರಿಯಾದ ಸ್ಥಾನದಲ್ಲಿದೆ", en: "correct position" },
  wordGameStatusPresent: { kn: "ಪದದಲ್ಲಿದೆ, ಬೇರೆ ಸ್ಥಾನದಲ್ಲಿ", en: "in the word, wrong position" },
  wordGameStatusAbsent: { kn: "ಪದದಲ್ಲಿಲ್ಲ", en: "not in the word" },
  wordGameCellLabel: { kn: "{n}ನೇ ಅಕ್ಷರ: {status}", en: "akshara {n}: {status}" },
  wordGameInputLabel: { kn: "{count} ಅಕ್ಷರಗಳ ಪದ ಬರೆಯಿರಿ", en: "Type a {count}-akshara word" },
  wordGameSubmit: { kn: "ಊಹಿಸಿ", en: "Guess" },
  wordGameWrongLength: { kn: "{count} ಅಕ್ಷರಗಳ ಪದ ಬೇಕು.", en: "Enter a {count}-akshara word." },
  wordGameNotInPool: { kn: "ಈ ಪದ ನಮ್ಮ ಪದಪಟ್ಟಿಯಲ್ಲಿ ಇಲ್ಲ.", en: "That word is not in this game's word list." },
  wordGameWon: { kn: "ಅಭಿನಂದನೆಗಳು! ಸರಿಯಾಗಿ ಊಹಿಸಿದಿರಿ.", en: "Well done — you guessed it!" },
  wordGameLost: { kn: "ಈ ಬಾರಿ ಆಗಲಿಲ್ಲ.", en: "Not this time." },
  wordGameAnswerWas: { kn: "ಪದ: {word}", en: "The word was: {word}" },
  wordGameMeaning: { kn: "ಅರ್ಥ: {meaning}", en: "Meaning: {meaning}" },
  wordGameGuessCount: { kn: "ಪ್ರಯತ್ನ {n} / {total}", en: "Guess {n} of {total}" },
  wordGameComeBackTomorrow: { kn: "ನಾಳೆ ಹೊಸ ಪದ ಬರುತ್ತದೆ.", en: "A new word arrives tomorrow." },
  wordGameLoadError: { kn: "ಪದ ಪಟ್ಟಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ", en: "Could not load the word list" },
} as const satisfies Record<string, Record<Locale, string>>;
