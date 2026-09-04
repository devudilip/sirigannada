import { hasStorage, readStorage, writeStorage } from "@/lib/storage";
import { DICT_FAVOURITES_KEY } from "@/features/dictionary/types";
import { parseStringList } from "@/features/dictionary/lib/savedLists";
import { COLLECTIONS_STORAGE_KEY, type CollectionsData } from "../types";
import { emptyCollectionsData, migrateFavouriteWords } from "./collections";

/**
 * Loads collections data, migrating legacy flat dictionary favourites on first run.
 * The old `dict:favourites` key is left untouched — this only reads it once.
 */
export function loadCollectionsData(): CollectionsData {
  if (!hasStorage(COLLECTIONS_STORAGE_KEY)) {
    const oldWords = parseStringList(readStorage<unknown>(DICT_FAVOURITES_KEY, []));
    const migrated = migrateFavouriteWords(oldWords);
    if (migrated) {
      writeStorage(COLLECTIONS_STORAGE_KEY, migrated);
      return migrated;
    }
  }
  return readStorage<CollectionsData>(COLLECTIONS_STORAGE_KEY, emptyCollectionsData());
}

export function saveCollectionsData(data: CollectionsData): void {
  writeStorage(COLLECTIONS_STORAGE_KEY, data);
}
