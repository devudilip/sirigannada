import type { Locale } from "./types";

/**
 * Strings for sharing a verse as an image (B-03), kept in their own module so `i18n.ts` stays
 * under the file-size limit. Spread into `strings` in `i18n.ts` — always go through
 * `t("shareAsImage")` etc. from there, never import this file directly.
 */
export const shareStrings = {
  verseActionsSheetTitle: { kn: "ಪದ್ಯದ ಕ್ರಿಯೆಗಳು", en: "Verse actions" },
  shareAsImage: { kn: "ಚಿತ್ರವಾಗಿ ಹಂಚಿ", en: "Share as image" },
  shareImageSheetTitle: { kn: "ಪದ್ಯದ ಚಿತ್ರ", en: "Verse image" },
  shareImagePreviewAlt: { kn: "ಪದ್ಯದ ಚಿತ್ರದ ಮುನ್ನೋಟ", en: "Preview of the verse image" },
  shareImageDownload: { kn: "PNG ಡೌನ್‌ಲೋಡ್", en: "Download PNG" },
  shareImageShare: { kn: "ಹಂಚಿ", en: "Share" },
  shareImagePreparing: { kn: "ಚಿತ್ರ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…", en: "Preparing image…" },
} as const satisfies Record<string, Record<Locale, string>>;
