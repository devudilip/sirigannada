import { toggleFavourite } from "./collections";
import { hasStorage, readStorage, writeStorage } from "@/lib/storage";
import { DICT_FAVOURITES_KEY } from "@/features/dictionary/types";
import { parseStringList } from "@/features/dictionary/lib/savedLists";
import { COLLECTIONS_STORAGE_KEY, FAVOURITES_COLLECTION_ID, type CollectionsData } from "../types";
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
  const words = data.collections.find((c) => c.id === FAVOURITES_COLLECTION_ID)?.items
    .flatMap((item) => item.kind === "word" ? [item.word] : []) ?? [];
  writeStorage(DICT_FAVOURITES_KEY, words);
}

/** Load/migrate before toggling so the first saved word cannot toggle itself back off. */
export function toggleSavedWord(word: string): string[] {
  const next = toggleFavourite(loadCollectionsData(), { kind: "word", word });
  saveCollectionsData(next);
  return next.collections.find((c) => c.id === FAVOURITES_COLLECTION_ID)?.items
    .flatMap((item) => item.kind === "word" ? [item.word] : []) ?? [];
}
