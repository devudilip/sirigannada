import type { Locale } from "./types";

/**
 * Strings for the offline practice/quiz feature (L-08: word↔meaning match, ಕಾಗುಣಿತ drills,
 * favourites flashcards), kept in their own module so `i18n.ts` stays under the file-size limit.
 * Spread into `strings` in `i18n.ts` — always go through `t("practiceTitle")` etc. from there,
 * never import this file directly.
 */
export const practiceStrings = {
  practiceTitle: { kn: "ಅಭ್ಯಾಸ", en: "Practice" },
  practiceSub: { kn: "ಪದದ ಅರ್ಥ, ಕಾಗುಣಿತ, ಮತ್ತು ಮೆಚ್ಚಿನ ಪದಗಳ ಅಭ್ಯಾಸ. ಆಫ್‌ಲೈನ್, ಈ ಸಾಧನದಲ್ಲೇ.", en: "Practice word meanings, gunitakshara, and your favourite words. Offline, on this device." },
  practiceModeMatch: { kn: "ಪದ ↔ ಅರ್ಥ", en: "Word ↔ meaning" },
  practiceModeMatchSub: { kn: "ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ.", en: "Pick the correct meaning for each word." },
  practiceModeGunita: { kn: "ಕಾಗುಣಿತ", en: "Gunitakshara" },
  practiceModeGunitaSub: { kn: "ವ್ಯಂಜನ ಮತ್ತು ಸ್ವರಚಿಹ್ನೆಗಳ ಅಭ್ಯಾಸ.", en: "Practice consonant + vowel-sign combinations." },
  practiceModeFlashcards: { kn: "ಮೆಚ್ಚಿನ ಪದಗಳ ಕಾರ್ಡ್", en: "Favourites flashcards" },
  practiceModeFlashcardsSub: { kn: "ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಪದಗಳನ್ನು ಪುನರಾವರ್ತಿಸಿ.", en: "Review your starred words." },
  practiceBack: { kn: "ಅಭ್ಯಾಸಕ್ಕೆ ಹಿಂತಿರುಗಿ", en: "Back to practice" },
  practiceScore: { kn: "ಅಂಕ {correct} / {total}", en: "Score {correct} / {total}" },
  practiceNext: { kn: "ಮುಂದೆ", en: "Next" },
  practiceCorrect: { kn: "ಸರಿಯಾಗಿದೆ!", en: "Correct!" },
  practiceIncorrect: { kn: "ತಪ್ಪಾಗಿದೆ", en: "Not quite" },
  practiceRestart: { kn: "ಮತ್ತೆ ಆರಂಭಿಸಿ", en: "Start again" },
  practiceMatchPrompt: { kn: "{word} ಎಂದರೆ ಏನು?", en: "What does {word} mean?" },
  practiceComposePrompt: { kn: "{consonant} + {vowel} ಸೇರಿದರೆ ಯಾವ ಅಕ್ಷರ?", en: "{consonant} + {vowel} makes which akshara?" },
  practiceIdentifyPrompt: { kn: "{akshara} ನಲ್ಲಿ ಯಾವ ಸ್ವರಚಿಹ್ನೆ ಇದೆ?", en: "Which vowel sign does {akshara} use?" },
  practiceDone: { kn: "ಅಭ್ಯಾಸ ಮುಗಿಯಿತು", en: "Session complete" },
  practiceDoneScore: { kn: "ನಿಮ್ಮ ಅಂಕ: {correct} / {total}", en: "Your score: {correct} / {total}" },
  practiceFlashcardsEmpty: { kn: "ಇನ್ನೂ ಯಾವುದೇ ಪದವನ್ನು ಮೆಚ್ಚಿಲ್ಲ. ನಿಘಂಟಿನಲ್ಲಿ ★ ಒತ್ತಿ ಪದಗಳನ್ನು ಸೇರಿಸಿ.", en: "No favourite words yet. Tap ★ on a dictionary entry to add one." },
  practiceFlashcardsFlip: { kn: "ಅರ್ಥ ನೋಡಲು ಒತ್ತಿ", en: "Tap to see the meaning" },
  practiceFlashcardsProgress: { kn: "{n} / {total}", en: "{n} of {total}" },
  practiceFlashcardsNoMeaning: { kn: "ಅರ್ಥ ಸಿಗಲಿಲ್ಲ", en: "No meaning found" },
  practiceChooseAnswer: { kn: "ಉತ್ತರ ಆಯ್ಕೆ", en: "Choose an answer" },
} as const satisfies Record<string, Record<Locale, string>>;
