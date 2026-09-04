import type { Locale } from "./types";

export const padabandhaStrings = {
  padabandhaTitle: { kn: "ಪದಬಂಧ", en: "Kannada crossword" },
  padabandhaSub: { kn: "ಸುಳಿವು ಓದಿ ಕನ್ನಡ ಪದಗಳನ್ನು ಜೋಡಿಸಿ. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಆಡಬಹುದು.", en: "Use the clues to join Kannada words. Works offline." },
  padabandhaInstructions: { kn: "ಸುಳಿವು ಆರಿಸಿ, ಪೂರ್ಣ ಪದವನ್ನು ಬರೆಯಿರಿ. ಒತ್ತಕ್ಷರ ಒಂದೇ ಚೌಕದಲ್ಲಿ ಬರುತ್ತದೆ.", en: "Choose a clue and type the whole word. A conjunct belongs in one square." },
  padabandhaAcross: { kn: "ಅಡ್ಡ", en: "Across" },
  padabandhaDown: { kn: "ಕೆಳಗೆ", en: "Down" },
  padabandhaAnswer: { kn: "{number}. ಉತ್ತರ", en: "{number}. Answer" },
  padabandhaAksharaCount: { kn: "{count} ಅಕ್ಷರ", en: "{count} aksharas" },
  padabandhaCheck: { kn: "ಉತ್ತರಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ", en: "Check answers" },
  padabandhaHint: { kn: "ಒಂದು ಅಕ್ಷರದ ಸುಳಿವು", en: "Reveal one akshara" },
  padabandhaClear: { kn: "ಈ ಉತ್ತರ ಅಳಿಸಿ", en: "Clear this answer" },
  padabandhaProgress: { kn: "{done} / {total} ಉತ್ತರಗಳು ಸರಿ", en: "{done} of {total} answers correct" },
  padabandhaComplete: { kn: "ಅಭಿನಂದನೆಗಳು! ಪದಬಂಧ ಪೂರ್ಣವಾಯಿತು.", en: "Well done! You completed the crossword." },
  padabandhaTryAgain: { kn: "ಇನ್ನೂ ಕೆಲವು ಉತ್ತರಗಳನ್ನು ಸರಿಪಡಿಸಿ.", en: "A few answers still need another look." },
  padabandhaKeyboard: { kn: "ಕನ್ನಡ ಕೀಲಿಮಣೆ", en: "Kannada keyboard" },
  padabandhaReset: { kn: "ಮತ್ತೆ ಆರಂಭಿಸಿ", en: "Start again" },
  padabandhaResetConfirm: { kn: "ಈ ಪದಬಂಧದ ಎಲ್ಲಾ ಉತ್ತರಗಳನ್ನು ಅಳಿಸಬೇಕೆ?", en: "Clear every answer in this crossword?" },
  padabandhaCellEmpty: { kn: "ಖಾಲಿ", en: "empty" },
  padabandhaLicense: { kn: "ಮೂಲ ಸುಳಿವುಗಳು · CC BY-SA 4.0", en: "Original clues · CC BY-SA 4.0" },
} as const satisfies Record<string, Record<Locale, string>>;
