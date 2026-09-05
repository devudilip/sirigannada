import type { Locale } from "./types";

/**
 * Strings for the shared "share as image card" feature (S-01). Kept in their own module so
 * `i18n.ts` stays under its size limit. Spread into `strings` in `i18n.ts`; always reach them
 * through `t("shareCard…")`, never import this file directly.
 *
 * The on-card kind chip and caption use fixed Kannada labels for every locale (the card is a
 * Kannada artefact), so those keys read the same in `kn` and `en` on purpose.
 */
export const shareCardStrings = {
  shareCardAction: { kn: "ಚಿತ್ರ ಹಂಚಿ", en: "Share as image" },
  shareCardSheetTitle: { kn: "ಚಿತ್ರವಾಗಿ ಹಂಚಿ", en: "Share as image" },
  shareCardPreviewAlt: { kn: "ಹಂಚಿಕೆ ಚಿತ್ರದ ಮುನ್ನೋಟ", en: "Preview of the share image" },
  shareCardPreparing: { kn: "ಚಿತ್ರ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…", en: "Preparing image…" },
  shareCardDownload: { kn: "PNG ಡೌನ್‌ಲೋಡ್", en: "Download PNG" },
  shareCardShare: { kn: "ಹಂಚಿ", en: "Share" },
  shareCardCopyImage: { kn: "ಚಿತ್ರ ನಕಲಿಸಿ", en: "Copy image" },
  shareCardCopyCaption: { kn: "ಶೀರ್ಷಿಕೆ ನಕಲಿಸಿ", en: "Copy caption" },
  shareCardCopyLink: { kn: "ಕೊಂಡಿ ನಕಲಿಸಿ", en: "Copy link" },
  shareCardCopied: { kn: "ನಕಲಾಯಿತು", en: "Copied" },
  shareCardRefused: { kn: "ಈ ಪಠ್ಯದಿಂದ ಚಿತ್ರ ಮಾಡಲಾಗಲಿಲ್ಲ", en: "Can’t make an image from this text" },
  shareCardSizePortrait: { kn: "4:5", en: "4:5" },
  shareCardSizeSquare: { kn: "1:1", en: "1:1" },
  shareCardPreviewTitle: { kn: "ಹಂಚಿಕೆ ಚಿತ್ರ ಮುನ್ನೋಟ", en: "Share card preview" },
  shareCardVerseMenu: { kn: "ಹೊಸ ಹಂಚಿಕೆ ಕಾರ್ಡ್", en: "Share card (new)" },
} as const satisfies Record<string, Record<Locale, string>>;
