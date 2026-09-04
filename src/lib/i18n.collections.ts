import type { Locale } from "./types";

/**
 * Strings for the local collections feature (F-03), kept in their own module so `i18n.ts` stays
 * under the file-size limit. Spread into `strings` in `i18n.ts` — always go through
 * `t("collectionsTitle")` etc. from there, never import this file directly.
 */
export const collectionsStrings = {
  collectionsTitle: { kn: "ನನ್ನ ಸಂಗ್ರಹಗಳು", en: "My collections" },
  collectionsSub: { kn: "ಪದ, ಪದ್ಯ, ಗಾದೆಗಳನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿ.", en: "Save words, verses, and proverbs on this device." },
  collectionsEmpty: { kn: "ಇನ್ನೂ ಯಾವುದೇ ಸಂಗ್ರಹವಿಲ್ಲ.", en: "No collections yet." },
  collectionNew: { kn: "ಹೊಸ ಸಂಗ್ರಹ", en: "New collection" },
  collectionNamePlaceholder: { kn: "ಸಂಗ್ರಹದ ಹೆಸರು…", en: "Collection name…" },
  collectionCreate: { kn: "ರಚಿಸಿ", en: "Create" },
  collectionRename: { kn: "ಹೆಸರು ಬದಲಿಸಿ", en: "Rename" },
  collectionDelete: { kn: "ಅಳಿಸಿ", en: "Delete" },
  collectionDeleteConfirm: { kn: "\"{name}\" ಸಂಗ್ರಹವನ್ನು ಅಳಿಸಬೇಕೆ? ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗದು.", en: "Delete the \"{name}\" collection? This cannot be undone." },
  collectionItemCount: { kn: "{count} ವಸ್ತುಗಳು", en: "{count} items" },
  collectionEmptyItems: { kn: "ಈ ಸಂಗ್ರಹದಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ.", en: "Nothing saved here yet." },
  collectionNoteLabel: { kn: "ಟಿಪ್ಪಣಿ", en: "Note" },
  collectionNotePlaceholder: { kn: "ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ…", en: "Add a note…" },
  collectionRemoveItem: { kn: "ಸಂಗ್ರಹದಿಂದ ತೆಗೆಯಿರಿ", en: "Remove from collection" },
  collectionKindWord: { kn: "ಪದ", en: "Word" },
  collectionKindVerse: { kn: "ಪದ್ಯ", en: "Verse" },
  collectionKindProverb: { kn: "ಗಾದೆ", en: "Proverb" },
  collectionExportAll: { kn: "ಎಲ್ಲವನ್ನೂ ರಫ್ತು ಮಾಡಿ", en: "Export all" },
  collectionExportOne: { kn: "ರಫ್ತು ಮಾಡಿ", en: "Export" },
  collectionImport: { kn: "ಆಮದು ಮಾಡಿ", en: "Import" },
  collectionImportSuccess: { kn: "ಆಮದು ಯಶಸ್ವಿಯಾಗಿದೆ.", en: "Import successful." },
  collectionImportError: { kn: "ಆಮದು ವಿಫಲವಾಗಿದೆ; ಕಡತದ ರೂಪ ಸರಿಯಿಲ್ಲ.", en: "Import failed; the file's shape is not valid." },
  collectionPrint: { kn: "ಮುದ್ರಿಸಿ", en: "Print" },
  collectionOpenSource: { kn: "ಮೂಲಕ್ಕೆ ಹೋಗಿ", en: "Go to source" },
  saveToCollection: { kn: "ಸಂಗ್ರಹಕ್ಕೆ ಸೇರಿಸಿ", en: "Save to collection" },
  savedToCollection: { kn: "ಸಂಗ್ರಹದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ", en: "Saved to a collection" },
  saveToCollectionSheetTitle: { kn: "ಎಲ್ಲಿ ಉಳಿಸಬೇಕು?", en: "Save to…" },
  saveToNewCollection: { kn: "ಹೊಸ ಸಂಗ್ರಹಕ್ಕೆ ಸೇರಿಸಿ", en: "Save to a new collection" },
  favouritesCollectionName: { kn: "ಮೆಚ್ಚಿನವು", en: "Favourites" },
} as const satisfies Record<string, Record<Locale, string>>;
