import type { Locale } from "./types";

/** Strings for the site footer and the /contact page (GH issue #82). */
export const contactStrings = {
  navContact: { kn: "ಸಂಪರ್ಕ", en: "Contact" },
  contactTitle: { kn: "ಸಂಪರ್ಕ", en: "Contact" },
  contactSub: {
    kn: "ಅಭಿಪ್ರಾಯ, ಪ್ರಶ್ನೆ, ದೂರು ಅಥವಾ ದೋಷ — ಎಲ್ಲವೂ GitHubನಲ್ಲಿ, ಸಾರ್ವಜನಿಕವಾಗಿ. ಓದಲು ಖಾತೆ ಬೇಕಿಲ್ಲ; ಬರೆಯಲು ಉಚಿತ GitHub ಖಾತೆ ಬೇಕು.",
    en: "Feedback, questions, complaints, or bugs all go through GitHub, in the open. Reading needs no account; posting needs a free GitHub account.",
  },
  contactFeedbackTitle: { kn: "ಅಭಿಪ್ರಾಯ ಮತ್ತು ಸಲಹೆ", en: "Feedback and ideas" },
  contactFeedbackSub: {
    kn: "ಹೊಸ ಪುಸ್ತಕ, ಹೊಸ ಸಲಕರಣೆ, ಅಥವಾ ಏನಾದರೂ ಬದಲಾಗಬೇಕು ಎನಿಸಿದರೆ ಇಲ್ಲಿ ಹೇಳಿ.",
    en: "A book to add, a tool to build, or something that should change: say it here.",
  },
  contactQuestionTitle: { kn: "ಪ್ರಶ್ನೆ", en: "Questions" },
  contactQuestionSub: {
    kn: "ಬಳಕೆ, ಆಫ್‌ಲೈನ್, ಪರವಾನಗಿ, ಅಥವಾ “ಇದು ಇಲ್ಲಿ ಸೇರುತ್ತದೆಯೇ?” — ಕೇಳಿ.",
    en: "Usage, offline, licensing, or “does this belong here?” — ask.",
  },
  contactBugTitle: { kn: "ದೋಷ ಅಥವಾ ದೂರು", en: "Bugs and complaints" },
  contactBugSub: {
    kn: "ಏನಾದರೂ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲವೇ, ತಪ್ಪಿದೆಯೇ? ಹಂತಗಳು, ನಿರೀಕ್ಷೆ, ಆದದ್ದು, ಮತ್ತು ಫೋನ್/ಬ್ರೌಸರ್ ಹೆಸರಿಸಿ.",
    en: "Something broken or wrong? Give the steps, what you expected, what happened, and your phone or browser.",
  },
  contactOpen: { kn: "GitHubನಲ್ಲಿ ತೆರೆಯಿರಿ", en: "Open on GitHub" },
  contactNote: {
    kn: "ಇಲ್ಲಿ ಯಾವ ಸರ್ವರ್ ಇಲ್ಲ, ಯಾವ ಫಾರ್ಮ್ ಇಲ್ಲ; ನೀವು ಬರೆದದ್ದು ನೇರವಾಗಿ GitHubಗೆ ಹೋಗುತ್ತದೆ. ಪಠ್ಯದ ಹಕ್ಕು ಅಥವಾ ಮೂಲದ ಬಗ್ಗೆ ದೂರು ಇದ್ದರೆ ಪುಟದ ಕೊಂಡಿ ಮತ್ತು ಕಾರಣ ತಿಳಿಸಿ.",
    en: "There is no server and no form here; what you write goes straight to GitHub. For a rights or source complaint about a text, include the page link and the reason.",
  },
  footerLicence: { kn: "ತಂತ್ರಾಂಶ AGPL-3.0-or-later · ಮೂಲ ಬರಹ CC BY-SA 4.0", en: "Code AGPL-3.0-or-later · Original writing CC BY-SA 4.0" },
  footerNav: { kn: "ಅಡಿಟಿಪ್ಪಣಿ ಕೊಂಡಿಗಳು", en: "Footer links" },
} as const satisfies Record<string, Record<Locale, string>>;
