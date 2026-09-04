import type { Locale } from "./types";

/**
 * Strings for the offline Kannada text-health checker (F-07), kept in their own module so
 * `i18n.ts` stays under the file-size limit. Spread into `strings` in `i18n.ts` — always go
 * through `t("textHealthTitle")` etc. from there, never import this file directly.
 */
export const textHealthStrings = {
  textHealthTitle: { kn: "ಪಠ್ಯ ಆರೋಗ್ಯ ಪರೀಕ್ಷೆ", en: "Text health check" },
  textHealthSub: { kn: "ಕನ್ನಡ ಯುನಿಕೋಡ್, ಎನ್‌ಕೋಡಿಂಗ್ ಮತ್ತು ಅಂತರದ ಸಮಸ್ಯೆಗಳನ್ನು ಸಾಧನದಲ್ಲೇ ಪರಿಶೀಲಿಸಿ.", en: "Check Kannada Unicode, encoding, and spacing on your device." },
  textHealthInput: { kn: "ಪರಿಶೀಲಿಸಬೇಕಾದ ಪಠ್ಯ", en: "Text to check" },
  textHealthPlaceholder: { kn: "ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ…", en: "Paste Kannada text here…" },
  textHealthPrivacy: { kn: "ಪಠ್ಯವು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ; ಎಲ್ಲಿಯೂ ಕಳುಹಿಸುವುದಿಲ್ಲ.", en: "Your text stays on this device and is never uploaded." },
  textHealthEmpty: { kn: "ಪರಿಶೀಲಿಸಲು ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಅಂಟಿಸಿ.", en: "Paste Kannada text to begin checking." },
  textHealthHealthy: { kn: "ಗಮನಿಸಬೇಕಾದ ಸಮಸ್ಯೆಗಳು ಸಿಗಲಿಲ್ಲ.", en: "No issues needing attention were found." },
  textHealthFindings: { kn: "ಕಂಡ ಸಮಸ್ಯೆಗಳು: {count}", en: "Issues found: {count}" },
  textHealthTruncated: { kn: "ಮೊದಲ ಫಲಿತಾಂಶಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ; ಪಠ್ಯವನ್ನು ಚಿಕ್ಕ ಭಾಗಗಳಾಗಿ ಪರಿಶೀಲಿಸಿ.", en: "Only the first results are shown; check very large text in smaller sections." },
  textHealthLocation: { kn: "ಸಾಲು {line}, ಅಂಕಣ {column}", en: "Line {line}, column {column}" },
  textHealthSuggestion: { kn: "ಸಲಹೆ", en: "Suggestion" },
  textHealthApply: { kn: "ಬದಲಾವಣೆ ಅನ್ವಯಿಸಿ", en: "Apply change" },
  textHealthCopy: { kn: "ಪರಿಶೀಲಿಸಿದ ಪಠ್ಯ ನಕಲಿಸಿ", en: "Copy reviewed text" },
  textHealthCategoryNormalization: { kn: "ಯುನಿಕೋಡ್ ಸಾಮಾನ್ಯೀಕರಣ", en: "Unicode normalization" },
  textHealthCategoryLegacy: { kn: "ಹಳೆಯ ಅಕ್ಷರ ಸಂಕೇತ", en: "Legacy text" },
  textHealthCategoryInvisible: { kn: "ಅದೃಶ್ಯ ಅಕ್ಷರ", en: "Invisible character" },
  textHealthCategorySpacing: { kn: "ಅಂತರ", en: "Spacing" },
  textHealthCategoryPunctuation: { kn: "ವಿರಾಮಚಿಹ್ನೆ", en: "Punctuation" },
  textHealthCategoryEncoding: { kn: "ಎನ್‌ಕೋಡಿಂಗ್", en: "Encoding" },
  textHealthNonNfc: { kn: "ಈ ಪಠ್ಯವು ಮಾನಕ NFC ಯುನಿಕೋಡ್ ರೂಪದಲ್ಲಿಲ್ಲ.", en: "This text is not in standard NFC Unicode form." },
  textHealthLegacyNudi: { kn: "ಇದು ನುಡಿ/ಬರಹದಂತಹ ಹಳೆಯ ASCII ಫಾಂಟ್ ಪಠ್ಯವಾಗಿರಬಹುದು.", en: "This may be text from a legacy ASCII font such as Nudi or Baraha." },
  textHealthMixedLatin: { kn: "ಕನ್ನಡ ಪದದೊಳಗೆ ಲ್ಯಾಟಿನ್ ಅಕ್ಷರ ಸೇರಿದೆ.", en: "A Latin letter appears inside a Kannada word." },
  textHealthLatinMatraLeak: { kn: "ಲ್ಯಾಟಿನ್ ಅಕ್ಷರವು ಕನ್ನಡ ಸ್ವರಚಿಹ್ನೆಯ ಬದಲು ಬಂದಿರಬಹುದು.", en: "A Latin letter may have replaced a Kannada vowel sign." },
  textHealthInvisibleCharacter: { kn: "{character} ಎಂಬ ಅದೃಶ್ಯ ಅಕ್ಷರವಿದೆ; ಇದು ಉದ್ದೇಶಿತವೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.", en: "An invisible {character} character is present; check whether it is intentional." },
  textHealthRepeatedWhitespace: { kn: "ಅಗತ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂತರವಿದೆ.", en: "There is repeated horizontal spacing." },
  textHealthExtraBlankLines: { kn: "ಅಗತ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ಖಾಲಿ ಸಾಲುಗಳಿವೆ.", en: "There are extra blank lines." },
  textHealthRepeatedPunctuation: { kn: "ವಿರಾಮಚಿಹ್ನೆ ಪುನರಾವರ್ತನೆಯಾಗಿದೆ; ಇದು ಉದ್ದೇಶಿತವೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.", en: "A punctuation mark is repeated; check whether it is intentional." },
  textHealthEncodingMarker: { kn: "ಹಾಳಾದ ಎನ್‌ಕೋಡಿಂಗ್‌ನ ಗುರುತು ಕಂಡಿದೆ.", en: "A marker of damaged text encoding was found." },
  textHealthLegacyConversionDamage: { kn: "ಹಳೆಯ ಪಠ್ಯ ಪರಿವರ್ತನೆಯಿಂದ ಅಕ್ಷರ ಹಾಳಾಗಿರಬಹುದು.", en: "A character may have been damaged during legacy text conversion." },
  textHealthBrokenLineWrap: { kn: "ಸಾಲು ವಿಭಜನೆಯಿಂದ ಪದ ಮುರಿದಿರಬಹುದು.", en: "A word may have been split by a line wrap." },
} as const satisfies Record<string, Record<Locale, string>>;
