import type { Locale } from "./types";

/**
 * Verse action-sheet strings, kept in their own module so `i18n.ts` stays under the file-size
 * limit. Spread into `strings` in `i18n.ts` — always go through `t(...)` there, never import
 * this file directly. (The share-as-image card's own strings live in `i18n.shareCard.ts`.)
 */
export const shareStrings = {
  verseActionsSheetTitle: { kn: "ಪದ್ಯದ ಕ್ರಿಯೆಗಳು", en: "Verse actions" },
  currentPassage: { kn: "ಪ್ರಸ್ತುತ ಭಾಗ", en: "Current passage" },
  currentPassageActions: { kn: "ಪ್ರಸ್ತುತ ಭಾಗದ ಕ್ರಿಯೆಗಳು", en: "Current passage actions" },
} as const satisfies Record<string, Record<Locale, string>>;
