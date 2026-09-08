import type { Locale } from "./types";

/** Strings added by the UX-06 redesign (GH issue #79) for the more screens. */
export const moreStrings = {
  moreMine: { kn: "ನನ್ನದು", en: "Mine" },
  moreTools: { kn: "ಉಪಕರಣಗಳು", en: "Tools" },
  moreFooter: { kn: "ಇತರ ಕೊಂಡಿಗಳು", en: "Other links" },
} as const satisfies Record<string, Record<Locale, string>>;
