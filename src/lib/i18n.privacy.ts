import type { Locale } from "./types";

/**
 * Strings for the /privacy page (roadmap A-03), also the Play Store privacy policy URL. Keep it
 * true to what the code does: the site runs no analytics script, and the Play Data safety form
 * declares no data collected. Adding any tracking means changing this page and that form first.
 */
export const privacyStrings = {
  navPrivacy: { kn: "ಗೌಪ್ಯತೆ", en: "Privacy" },
  privacyTitle: { kn: "ಗೌಪ್ಯತೆ", en: "Privacy" },
  privacySub: {
    kn: "ಖಾತೆ ಇಲ್ಲ, ಜಾಹೀರಾತು ಇಲ್ಲ. ನೀವು ಉಳಿಸಿದ್ದು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಇರುತ್ತದೆ.",
    en: "No account, no ads. What you save stays on your device.",
  },
  privacyWho: {
    kn: "ಸಿರಿಗನ್ನಡ (sirigannada.in ಮತ್ತು Google Playನ ಆ್ಯಪ್) ದೇವರಾಜ್ ಕೆ (Devaraj K) ನಿರ್ವಹಿಸುವ ಮುಕ್ತ ಆಕರ ಯೋಜನೆ. ಕೊನೆಯ ಪರಿಷ್ಕರಣೆ: 22 ಸೆಪ್ಟೆಂಬರ್ 2026.",
    en: "Sirigannada (sirigannada.in and the app on Google Play) is an open-source project maintained by Devaraj K (ದೇವರಾಜ್ ಕೆ). Last updated: 22 September 2026.",
  },
  privacyDeviceTitle: { kn: "ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುವುದು", en: "What stays on your device" },
  privacyDeviceBody: {
    kn: "ಇಷ್ಟದ ಪದಗಳು, ಸಂಗ್ರಹಗಳು, ಟಿಪ್ಪಣಿಗಳು, ಓದಿದ ಜಾಗ, ಆಟದ ಪ್ರಗತಿ, ಆಯ್ಕೆಗಳು ಮತ್ತು ಆಫ್‌ಲೈನ್‌ಗೆ ಇಳಿಸಿದ ಪುಸ್ತಕ-ಕಥೆಗಳು ಈ ಬ್ರೌಸರ್‌ನ ಸಂಗ್ರಹದಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತವೆ. ಅವು ನಮಗೆ ಅಥವಾ ಬೇರೆ ಯಾರಿಗೂ ಹೋಗುವುದಿಲ್ಲ. ತಾಣದ ದತ್ತಾಂಶ ಅಳಿಸಿದರೆ ಅವೂ ಅಳಿಯುತ್ತವೆ.",
    en: "Starred words, collections, notes, reading position, game progress, settings, and books or stories saved for offline live only in this browser's storage on your device. They are never sent to us or anyone else. Clearing the site's data deletes them.",
  },
  privacyContinueTitle: { kn: "ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಮುಂದುವರಿಸುವುದು", en: "Continuing on another device" },
  privacyContinueBody: {
    kn: "ಆ ಕೊಂಡಿ ಅಥವಾ QR ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಕೊಂಡಿಯೊಳಗೇ ಒಯ್ಯುತ್ತದೆ; ಏನೂ ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ. ನೀವು ಕೊಂಡಿ ಕೊಟ್ಟವರು ಮಾತ್ರ ಅದನ್ನು ನೋಡಬಹುದು.",
    en: "The link or QR carries your progress inside the link itself; nothing is uploaded. Only people you give the link to can see it.",
  },
  privacyWebTitle: { kn: "ಭೇಟಿಗಳ ಅಂಕಿಅಂಶ", en: "Visitor statistics" },
  privacyWebBody: {
    kn: "ಈ ತಾಣದಲ್ಲಿ ಯಾವುದೇ ಅಂಕಿಅಂಶ ಸ್ಕ್ರಿಪ್ಟ್ ಇಲ್ಲ, ಕುಕೀಗಳೂ ಇಲ್ಲ. ತಾಣವನ್ನು ಒದಗಿಸುವ Cloudflare ತನ್ನ ಸರ್ವರ್ ದಾಖಲೆಗಳಿಂದ ಭೇಟಿಗಳನ್ನು ಒಟ್ಟು ಮೊತ್ತವಾಗಿ ಮಾತ್ರ ಎಣಿಸುತ್ತದೆ: ಕೇಳಿದ ಪುಟಗಳು, ದೇಶ ಮತ್ತು ಬ್ರೌಸರ್‌ನ ಬಗೆ. ಯಾವುದೇ ಜಾಲ ಸರ್ವರ್‌ನಂತೆ, ಪುಟ ಕಳುಹಿಸಲು ಅದಕ್ಕೆ ನಿಮ್ಮ ನೆಟ್‌ವರ್ಕ್ ವಿಳಾಸ ಕಾಣುತ್ತದೆ.",
    en: "This site runs no analytics script and sets no cookies. Cloudflare, which hosts the site and delivers every page, counts visits from its own server records, as totals only: pages requested, country, and browser type. Like any web server, it sees your network address in order to send the page.",
  },
  privacyAppTitle: { kn: "Android ಆ್ಯಪ್", en: "Android app" },
  privacyAppBody: {
    kn: "Google Playನ ಸಿರಿಗನ್ನಡ ಆ್ಯಪ್ ಇದೇ ತಾಣವನ್ನು Chromeನಲ್ಲಿ ತೆರೆಯುತ್ತದೆ, ಹಾಗಾಗಿ ಮೇಲಿನದೆಲ್ಲ ಅದಕ್ಕೂ ಅನ್ವಯಿಸುತ್ತದೆ. ಆ್ಯಪ್ ಯಾವ ಅನುಮತಿಯನ್ನೂ ಕೇಳುವುದಿಲ್ಲ, ತನ್ನದೇ ಆಗಿ ಯಾವ ಮಾಹಿತಿಯನ್ನೂ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
    en: "The Sirigannada app on Google Play opens this same site in Chrome, so everything above applies to it too. The app asks for no permissions and collects nothing of its own.",
  },
  privacyFormsTitle: { kn: "ಸಂಪರ್ಕ ಮತ್ತು ಹೊರಗಿನ ಕೊಂಡಿಗಳು", en: "Contact and outside links" },
  privacyFormsBody: {
    kn: "ಸಂಪರ್ಕ ಫಾರ್ಮ್ ಮೂಲಕ ಕಳುಹಿಸಿದ ಸಂದೇಶ Google Formsಗೆ, GitHub ಬರಹಗಳು GitHubಗೆ ಹೋಗುತ್ತವೆ; ಅವುಗಳಿಗೆ ಅವುಗಳದೇ ಗೌಪ್ಯತಾ ನೀತಿ ಇದೆ. ಉತ್ತರ ಬೇಕಿದ್ದರೆ ಮಾತ್ರ ಇಮೇಲ್ ಕೊಡಿ. Instagram, X, ವಿಕಿಸೋರ್ಸ್‌ನಂತಹ ಹೊರಗಿನ ತಾಣಗಳ ಕೊಂಡಿಗಳು ಅವುಗಳ ನಿಯಮಗಳಿಗೆ ಒಳಪಡುತ್ತವೆ.",
    en: "Messages sent through the contact form go to Google Forms, and posts on GitHub go to GitHub, under their own privacy policies. Give an email only if you want a reply. Links to outside sites such as Instagram, X, and Wikisource follow those sites' rules.",
  },
  privacyChildrenTitle: { kn: "ಮಕ್ಕಳು", en: "Children" },
  privacyChildrenBody: {
    kn: "ಮಕ್ಕಳು ಖಾತೆ ಇಲ್ಲದೆ ತಾಣದ ಎಲ್ಲ ಭಾಗಗಳನ್ನು ಬಳಸಬಹುದು. ನಾವು ಹೆಸರು, ವಯಸ್ಸು ಅಥವಾ ಸಂಪರ್ಕ ವಿವರ ಕೇಳುವುದಿಲ್ಲ; ಮಗು ಉಳಿಸಿದ್ದು ಸಾಧನದಿಂದ ಹೊರಹೋಗುವುದಿಲ್ಲ.",
    en: "Children can use every part of the site without an account. We never ask for a name, age, or contact details, and nothing a child saves leaves the device.",
  },
  privacyChangesTitle: { kn: "ಬದಲಾವಣೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆಗಳು", en: "Changes and questions" },
  privacyChangesBody: {
    kn: "ಈ ನೀತಿ ಬದಲಾದರೆ ಇದೇ ಪುಟ ಮತ್ತು ದಿನಾಂಕ ಬದಲಾಗುತ್ತದೆ; ಹಿಂದಿನ ಆವೃತ್ತಿಗಳು GitHubನಲ್ಲಿ ಇವೆ. ಪ್ರಶ್ನೆ ಇದ್ದರೆ ಸಂಪರ್ಕ ಪುಟ ಬಳಸಿ.",
    en: "If this policy changes, this page and its date change; earlier versions are on GitHub. For questions, use the Contact page.",
  },
} as const satisfies Record<string, Record<Locale, string>>;
