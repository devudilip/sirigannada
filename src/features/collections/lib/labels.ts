import type { StringKey } from "@/lib/i18n";
import { FAVOURITES_COLLECTION_ID, type Collection } from "../types";

/** Display name for a collection: the implicit Favourites collection is always shown localized. */
export function collectionDisplayName(collection: Collection, t: (key: StringKey) => string): string {
  return collection.id === FAVOURITES_COLLECTION_ID ? t("favouritesCollectionName") : collection.name;
}
