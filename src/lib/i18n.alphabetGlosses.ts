import type { Locale } from "./types";

/**
 * Example-word glosses shown on the alphabet page (ವರ್ಣಮಾಲೆ), kept in their own module so
 * `i18n.ts` stays under the file-size limit. Spread into `strings` in `i18n.ts` — always go
 * through `t("alphabetGlossAkka")` etc. from there, never import this file directly.
 */
export const alphabetGlossStrings = {
  alphabetGlossAkka: { kn: "ಹಿರಿಯ ಸೋದರಿ", en: "elder sister" },
  alphabetGlossAnna: { kn: "ಆಹಾರ", en: "cooked rice" },
  alphabetGlossAppa: { kn: "ತಂದೆ", en: "father" },
  alphabetGlossAmma: { kn: "ತಾಯಿ", en: "mother" },
  alphabetGlossBatte: { kn: "ಉಡುಪು", en: "cloth" },
  alphabetGlossElla: { kn: "ಸಮಸ್ತ", en: "all" },
  alphabetGlossKannu: { kn: "ನೋಟದ ಅಂಗ", en: "eye" },
  alphabetGlossCakra: { kn: "ಗಾಲಿ", en: "wheel" },
  alphabetGlossMitra: { kn: "ಸ್ನೇಹಿತ", en: "friend" },
  alphabetGlossPriti: { kn: "ವಾತ್ಸಲ್ಯ", en: "love" },
  alphabetGlossSrama: { kn: "ದುಡಿಮೆ", en: "effort" },
  alphabetGlossPaksi: { kn: "ಹಕ್ಕಿ", en: "bird" },
  alphabetGlossJnana: { kn: "ತಿಳಿವು", en: "knowledge" },
  alphabetGlossKasta: { kn: "ಬಳಲಿಕೆ", en: "hardship" },
  alphabetGlossBuddhi: { kn: "ವಿವೇಕ", en: "intellect" },
  alphabetGlossSatya: { kn: "ನಿಜ", en: "truth" },
} as const satisfies Record<string, Record<Locale, string>>;
