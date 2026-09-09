import { writeStorage } from "@/lib/storage";
import { writeProgress } from "@/features/reader/lib/settings";
import { loadCollectionsData, saveCollectionsData } from "@/features/collections/lib/storage";
import { addItem, createCollection, findCollection } from "@/features/collections/lib/collections";
import { FAVOURITES_COLLECTION_ID } from "@/features/collections/types";
import { parseStoredValues } from "@/features/padabandha/lib/puzzle";
import type { ProgressBlob } from "../types";

/**
 * Writes a decoded blob into the same local keys each feature already reads — no second save
 * format. Returns the screen to land on (reading position wins, then games, then collections).
 * `loadWordGameState` tolerates the target-less daily-word record this writes.
 */
export function applyProgress(blob: ProgressBlob): { route: string } {
  let route = "/";

  if (blob.stars) {
    let data = loadCollectionsData();
    const now = Date.now();
    if (!findCollection(data, FAVOURITES_COLLECTION_ID)) {
      data = createCollection(data, "Favourites", now, FAVOURITES_COLLECTION_ID);
    }
    for (const word of blob.stars.words) {
      data = addItem(data, FAVOURITES_COLLECTION_ID, { kind: "word", word }, undefined, now);
    }
    for (const proverbId of blob.stars.gade) {
      data = addItem(data, FAVOURITES_COLLECTION_ID, { kind: "proverb", proverbId }, undefined, now);
    }
    saveCollectionsData(data);
    route = "/collections";
  }

  if (blob.dailyWord) {
    writeStorage(`wordgame:${blob.dailyWord.date}`, { date: blob.dailyWord.date, guesses: blob.dailyWord.guesses });
    route = "/learn";
  }

  if (blob.padabandha) {
    writeStorage(`padabandha:${blob.padabandha.packId}:v1`, parseStoredValues(blob.padabandha.grid));
    route = "/learn/padabandha";
  }

  if (blob.library) {
    writeProgress(blob.library.bookId, blob.library.verseId ?? 0, blob.library.page);
    route = `/library/${blob.library.bookId}`;
    if (blob.library.verseId != null) route += `#b${blob.library.verseId}`;
  }

  return { route };
}
