import type { StringKey } from "@/lib/i18n";
import type { OfflineCategoryId } from "../types";

export interface OfflineCategoryMeta {
  id: OfflineCategoryId;
  titleKey: StringKey;
}

export const OFFLINE_CATEGORIES: readonly OfflineCategoryMeta[] = [
  { id: "shell", titleKey: "offlineCategoryShell" },
  { id: "dictionary", titleKey: "offlineCategoryDictionary" },
  { id: "books", titleKey: "offlineCategoryBooks" },
  { id: "proverbs", titleKey: "offlineCategoryProverbs" },
];
