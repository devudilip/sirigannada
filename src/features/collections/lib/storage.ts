import { addItem, ensureCollection, toggleFavourite } from "./collections";
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
  const oldWords = parseStringList(readStorage<unknown>(DICT_FAVOURITES_KEY, []));
  let data = hasStorage(COLLECTIONS_STORAGE_KEY)
    ? readStorage<CollectionsData>(COLLECTIONS_STORAGE_KEY, emptyCollectionsData())
    : migrateFavouriteWords(oldWords) ?? emptyCollectionsData();
  // Recover stars saved by older versions before two-way synchronisation existed.
  if (!readStorage("collections:dictionary-sync-v2", false)) {
    for (const word of oldWords) {
      data = addItem(ensureCollection(data, FAVOURITES_COLLECTION_ID, "Favourites", Date.now()), FAVOURITES_COLLECTION_ID, { kind: "word", word });
    }
    writeStorage(COLLECTIONS_STORAGE_KEY, data);
    writeStorage("collections:dictionary-sync-v2", true);
  }
  return data;
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
