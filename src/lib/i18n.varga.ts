import type { Locale } from "./types";

/**
 * Strings for the ವ್ಯಂಜನ ವರ್ಗ lesson (/learn/varga). Spread into `strings` in `i18n.ts`; always go
 * through `t("vargaTitle")` etc. from there, never import this file directly. The lesson's body
 * text lives with its data in `features/learn/lib/varga.ts`.
 */
export const vargaStrings = {
  vargaTitle: { kn: "ವ್ಯಂಜನ ವರ್ಗ: ಕ ಯಾಕೆ ಮೊದಲು?", en: "Consonant vargas: why ಕ comes first" },
  vargaSub: { kn: "ಗಂಟಲಿನಿಂದ ತುಟಿಯವರೆಗೆ: ಶಬ್ದ ಹುಟ್ಟುವ ಜಾಗದಿಂದ ವ್ಯಂಜನಗಳ ಕ್ರಮ.", en: "From the throat to the lips: the consonant order follows where each sound is made." },
  vargaIntro: { kn: "ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಕ ಮೊದಲು, ಪ ಕೊನೆಗೆ. ಇದು ಸುಮ್ಮನೆ ಮಾಡಿದ ಕ್ರಮವಲ್ಲ. ಶಬ್ದ ಹುಟ್ಟುವ ಜಾಗ ಬಾಯಿಯ ಒಳಗಿನಿಂದ ಹೊರಕ್ಕೆ ಸರಿದಂತೆ ವರ್ಗಗಳೂ ಸಾಗುತ್ತವೆ: ಗಂಟಲು, ಅಂಗುಳ, ಬಾಯಿಯ ಮೇಲ್ಭಾಗ, ಹಲ್ಲು, ತುಟಿ. ಪ್ರತಿ ಅಕ್ಷರವನ್ನು ಜೋರಾಗಿ ಹೇಳಿ, ನಾಲಿಗೆ ಎಲ್ಲಿ ತಾಗುತ್ತದೆ ಎಂದು ಗಮನಿಸಿ.", en: "In the alphabet ಕ comes first and ಪ last. The order is not arbitrary: the vargas move with the place where the sound is made, from deep inside the mouth outwards: throat, palate, roof, teeth, lips. Say each letter aloud and notice where your tongue touches." },
  vargaFivePlaces: { kn: "ಐದು ಜಾಗ, ಐದು ವರ್ಗ", en: "Five places, five vargas" },
  vargaColumnsTitle: { kn: "ಒಂದು ವರ್ಗದ ಒಳಗೆ", en: "Inside one varga" },
  vargaColumnsIntro: { kn: "ಪ್ರತಿ ವರ್ಗದಲ್ಲೂ ಐದು ಅಕ್ಷರ, ಯಾವಾಗಲೂ ಒಂದೇ ಕ್ರಮದಲ್ಲಿ. ಜಾಗ ಒಂದೇ; ಬದಲಾಗುವುದು ಉಸಿರು (ಪ್ರಾಣ), ಗಂಟಲಿನ ನಡುಕ (ಘೋಷ) ಮತ್ತು ಮೂಗು.", en: "Every varga has five letters, always in the same order. The place stays the same; what changes is the breath (prāṇa), the buzz of the throat (ghōṣa), and the nose." },
  vargaMeaningTitle: { kn: "ಜಾಗ ಬದಲಾದರೆ ಅರ್ಥ ಬದಲು", en: "Move the place, change the word" },
  vargaMeaningIntro: { kn: "ನಾಲಿಗೆ ಸ್ವಲ್ಪ ಮುಂದೆ ಅಥವಾ ಹಿಂದೆ ಹೋದರೆ ಪದವೇ ಬೇರೆ.", en: "Move the tongue a little forward or back and you get a different word." },
  vargaAvargiyaTitle: { kn: "ಅವರ್ಗೀಯ ವ್ಯಂಜನಗಳು", en: "Consonants outside the vargas" },
  vargaAvargiyaBody: { kn: "ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ ಐದರ ಸಾಲಿಗೆ ಹೊಂದುವುದಿಲ್ಲ: ಇವುಗಳನ್ನು ಹೇಳುವಾಗ ಗಾಳಿ ಪೂರ್ತಿ ನಿಲ್ಲುವುದಿಲ್ಲ, ಹರಿಯುತ್ತಲೇ ಇರುತ್ತದೆ. ಯ ರ ಲ ವ ಅಂತಸ್ಥಗಳು; ಶ ಷ ಸ ಹ ಊಷ್ಮಗಳು (ಬಿಸಿ ಉಸಿರಿನ ಶಬ್ದ); ಳ ಕನ್ನಡದ ತನ್ನದೇ ಅಕ್ಷರ.", en: "ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ do not fit the rows of five: when you say them the air never fully stops, it keeps flowing. ಯ ರ ಲ ವ are the antastha (semivowels); ಶ ಷ ಸ ಹ are the ūṣma (breathy sibilants); ಳ is Kannada's own letter." },
  vargaVideo: { kn: "ಈ ಪಾಠವನ್ನು ವಿಡಿಯೋದಲ್ಲಿ ನೋಡಿ (YouTube)", en: "Watch this lesson as a video (YouTube)" },
  vargaFromChart: { kn: "ಕ ಯಾಕೆ ಮೊದಲು?", en: "Why ಕ first?" },
} as const satisfies Record<string, Record<Locale, string>>;
