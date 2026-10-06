import type { Locale } from "./types";

/**
 * Strings for /apps, the page that introduces the sibling products published under the
 * Sirigannada name on their own subdomains. Each sibling is a separate site with its own
 * storage, offline install, and privacy page; this page only links out.
 */
export const appsStrings = {
  navApps: { kn: "ಸಿರಿಗನ್ನಡ ಆ್ಯಪ್‌ಗಳು", en: "Sirigannada apps" },
  appsTitle: { kn: "ಸಿರಿಗನ್ನಡ ಆ್ಯಪ್‌ಗಳು", en: "Sirigannada apps" },
  appsSub: {
    kn: "ಇದೇ ಹೆಸರಿನಡಿ ಪ್ರಕಟವಾದ ಇತರ ಉಚಿತ ಆ್ಯಪ್‌ಗಳು. ಖಾತೆ ಇಲ್ಲ, ಜಾಹೀರಾತು ಇಲ್ಲ, ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಕೆಲಸ.",
    en: "Other free apps published under the same name. No account, no ads, and they work offline.",
  },
  appsLinkSub: {
    kn: "ಸಿರಿಗನ್ನಡ ಹೆಸರಿನ ಇತರ ಉಚಿತ ಆ್ಯಪ್‌ಗಳು.",
    en: "Other free apps under the Sirigannada name.",
  },
  appsHereTitle: { kn: "ನೀವು ಈಗ ಇಲ್ಲಿದ್ದೀರಿ", en: "You are here" },
  appsHereBody: {
    kn: "ಸಿರಿಗನ್ನಡ: ಕನ್ನಡ ನಿಘಂಟು, ಗ್ರಂಥಾಲಯ, ಗಾದೆಗಳು, ಮಕ್ಕಳ ಕಥೆಗಳು, ಕಲಿಕೆ ಮತ್ತು ಆಟಗಳು. www.sirigannada.in ಮತ್ತು Google Playನ ಆ್ಯಪ್.",
    en: "Sirigannada: the Kannada dictionary, library, proverbs, children's stories, learning, and games. www.sirigannada.in and the app on Google Play.",
  },
  appsOthersTitle: { kn: "ಇತರ ಆ್ಯಪ್‌ಗಳು", en: "Other apps" },
  appsKcetTitle: { kn: "KCET Prep", en: "KCET Prep" },
  appsKcetSub: {
    kn: "ಕರ್ನಾಟಕ CET (ಎಂಜಿನಿಯರಿಂಗ್) ತಯಾರಿ: ಅಧ್ಯಾಯವಾರು ಅಭ್ಯಾಸ, ಟಿಪ್ಪಣಿ, ಹಿಂದಿನ ವರ್ಷಗಳ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳು ಮತ್ತು ಅಣಕು ಪರೀಕ್ಷೆಗಳು. ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ.",
    en: "Karnataka CET (engineering) preparation: chapter-wise practice, notes, past papers, and mock tests. In English.",
  },
  appsOpen: { kn: "ತೆರೆಯಿರಿ", en: "Open" },
  appsNote: {
    kn: "ಪ್ರತಿ ಆ್ಯಪ್ ತನ್ನದೇ ತಾಣದಲ್ಲಿದೆ: ಅದರ ಸಂಗ್ರಹ, ಆಫ್‌ಲೈನ್ ಸ್ಥಾಪನೆ ಮತ್ತು ಗೌಪ್ಯತಾ ಪುಟ ಪ್ರತ್ಯೇಕ. ಇಲ್ಲಿ ಉಳಿಸಿದ್ದು ಅಲ್ಲಿಗೆ ಹೋಗುವುದಿಲ್ಲ.",
    en: "Each app lives on its own site, with its own storage, offline install, and privacy page. Nothing you save here is shared with them.",
  },
  aboutApps: {
    kn: "ಇದೇ ಹೆಸರಿನಡಿ ಇನ್ನೂ ಕೆಲವು ಉಚಿತ ಆ್ಯಪ್‌ಗಳಿವೆ:",
    en: "A few more free apps are published under the same name:",
  },
} as const satisfies Record<string, Record<Locale, string>>;
