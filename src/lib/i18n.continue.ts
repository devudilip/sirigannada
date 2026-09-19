import type { Locale } from "./types";

/**
 * Strings for cross-device continue (feat/continue-device). The site is a static export with no
 * server, so "continue" is an opt-in link + QR handoff: the whole progress blob rides in the URL
 * hash and never touches a server. Spread into `strings` in `i18n.ts`; always go through
 * `t("continueTitle")` etc.
 */
export const continueStrings = {
  continueTitle: { kn: "ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಮುಂದುವರಿಸಿ", en: "Continue on another device" },
  continueButton: { kn: "ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಮುಂದುವರಿಸಿ", en: "Continue on another device" },
  continueIntro: {
    kn: "ಈ QR ಅನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ ಫೋನ್/ಟ್ಯಾಬ್ಲೆಟ್‌ನಲ್ಲಿ ಕೊಂಡಿಯನ್ನು ತೆರೆಯಿರಿ. ನಿಮ್ಮ ಓದಿನ ಸ್ಥಳ, ಆಟಗಳು ಮತ್ತು ಇಷ್ಟದ ಪದಗಳು ವರ್ಗಾವಣೆಯಾಗುತ್ತವೆ. ಎಲ್ಲವೂ ಕೊಂಡಿಯೊಳಗೇ ಇರುತ್ತದೆ — ಯಾವ ಸರ್ವರ್‌ಗೂ ಏನೂ ಕಳುಹಿಸುವುದಿಲ್ಲ.",
    en: "Scan this code or open the link on your phone or tablet. Your place, saved games, and starred words move across. It all travels inside the link — nothing is sent to a server.",
  },
  continueScanHint: { kn: "ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಈ QR ಅನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", en: "Scan this QR on the other device" },
  continueLinkLabel: { kn: "ಕೊಂಡಿ", en: "Link" },
  continueTooLarge: {
    kn: "ಎಲ್ಲ ಪ್ರಗತಿಯನ್ನೂ ಕೊಂಡಿಯಲ್ಲಿ ಹಿಡಿಸಲಾಗಲಿಲ್ಲ. ಈ ಕೊಂಡಿ ಈಗಿನ ಪುಸ್ತಕವನ್ನು ಸರಿಯಾದ ಪುಟದಲ್ಲಿ ತೆರೆಯುತ್ತದೆ.",
    en: "Not all progress fit in the link. This link still opens your current book at the right page.",
  },
  continueApplying: { kn: "ಮುಂದುವರಿಸಲಾಗುತ್ತಿದೆ…", en: "Resuming…" },
  continueDone: { kn: "ಸಿದ್ಧ. ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ…", en: "Ready. Taking you there…" },
  continueOpenManually: { kn: "ಈಗ ತೆರೆಯಿರಿ", en: "Open now" },
  continueBadLink: { kn: "ಈ ಮುಂದುವರಿಕೆ ಕೊಂಡಿ ಸರಿಯಿಲ್ಲ ಅಥವಾ ಅವಧಿ ಮೀರಿದೆ.", en: "This continue link is broken or has expired." },
  continueBadLinkHelp: {
    kn: "ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಹೊಸ ಕೊಂಡಿಯನ್ನು ಪಡೆದು ಪೂರ್ತಿಯಾಗಿ ನಕಲಿಸಿ.",
    en: "Get a fresh link on the other device and copy the whole thing.",
  },
  continueNothing: {
    kn: "ವರ್ಗಾಯಿಸಲು ಇನ್ನೂ ಏನೂ ಇಲ್ಲ. ಸ್ವಲ್ಪ ಓದಿ, ಆಟವಾಡಿ, ಅಥವಾ ಒಂದು ಪದವನ್ನು ಇಷ್ಟಪಟ್ಟಿಗೆ ಸೇರಿಸಿ.",
    en: "Nothing to carry over yet. Read a little, play a game, or star a word first.",
  },
} as const satisfies Record<string, Record<Locale, string>>;
