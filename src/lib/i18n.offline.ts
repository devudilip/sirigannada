import type { Locale } from "./types";

/**
 * Strings for the offline storage manager (UX-04), kept in their own module so `i18n.ts` stays
 * under the file-size limit. Spread into `strings` in `i18n.ts` — always go through
 * `t("offlineManagerTitle")` etc. from there, never import this file directly.
 */
export const offlineStrings = {
  offlineManagerTitle: { kn: "ಆಫ್‌ಲೈನ್ ಸಂಗ್ರಹ", en: "Offline storage" },
  offlineManagerSub: {
    kn: "ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಯಾವುದು ಸಿದ್ಧವಾಗಿದೆ ಎಂದು ನೋಡಿ, ನವೀಕರಿಸಿ ಅಥವಾ ಅಳಿಸಿ.",
    en: "See what's ready offline, update it, or clear it.",
  },
  offlineCategoryShell: { kn: "ಆ್ಯಪ್ ಶೆಲ್", en: "App shell" },
  offlineCategoryDictionary: { kn: "ನಿಘಂಟು", en: "Dictionary" },
  offlineCategoryBooks: { kn: "ಪುಸ್ತಕಗಳು", en: "Books" },
  offlineCategoryProverbs: { kn: "ಗಾದೆಗಳು", en: "Proverbs" },
  offlineFilesOf: { kn: "{done} / {total} ಕಡತಗಳು", en: "{done} of {total} files" },
  offlineSizeLabel: { kn: "ಗಾತ್ರ", en: "Size" },
  offlineStatusReady: { kn: "ಸಿದ್ಧವಾಗಿದೆ", en: "Ready offline" },
  offlineStatusPartial: { kn: "ಭಾಗಶಃ ಸಿದ್ಧ", en: "Partially ready" },
  offlineStatusEmpty: { kn: "ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಇಲ್ಲ", en: "Not available offline" },
  offlineStatusUnavailable: { kn: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಆಫ್‌ಲೈನ್ ಸಂಗ್ರಹ ಲಭ್ಯವಿಲ್ಲ", en: "Offline storage isn't available in this browser" },
  offlineUpdate: { kn: "ನವೀಕರಿಸಿ", en: "Update" },
  offlineRetry: { kn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", en: "Retry" },
  offlineClear: { kn: "ಅಳಿಸಿ", en: "Clear" },
  offlineWorking: { kn: "ಇಳಿಸಲಾಗುತ್ತಿದೆ… {done} / {total}", en: "Downloading… {done} of {total}" },
  offlineFailedCount: { kn: "{count} ಕಡತಗಳು ಸಿಗಲಿಲ್ಲ", en: "{count} files failed" },
  offlineClearConfirm: {
    kn: "{category} ಅನ್ನು ಆಫ್‌ಲೈನ್ ಸಂಗ್ರಹದಿಂದ ಅಳಿಸಬೇಕೆ? ಮತ್ತೆ ಬಳಸಲು ಮರುಇಳಿಸಬೇಕಾಗುತ್ತದೆ.",
    en: "Clear {category} from offline storage? You'll need to download it again to use it offline.",
  },
  offlineClearConfirmAction: { kn: "ಹೌದು, ಅಳಿಸಿ", en: "Yes, clear it" },
  offlineRefresh: { kn: "ಸ್ಥಿತಿ ಮರುಪರಿಶೀಲಿಸಿ", en: "Recheck status" },
} as const satisfies Record<string, Record<Locale, string>>;
