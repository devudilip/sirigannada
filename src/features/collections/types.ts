/**
 * Local named collections of saved words, verses, and proverbs.
 * Nothing here ever leaves the device — see AGENTS.md non-goals.
 */

export type CollectionItemInput =
  | { kind: "word"; word: string }
  | { kind: "verse"; bookSlug: string; blockIndex: number }
  | { kind: "proverb"; proverbId: string };

export type CollectionItem = CollectionItemInput & {
  note?: string;
  addedAt: number;
};

export interface Collection {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  items: CollectionItem[];
}

export interface CollectionsData {
  collections: Collection[];
}

/** Portable JSON shape for export/import. */
export interface CollectionsExport {
  version: 1;
  exportedAt: number;
  collections: Collection[];
}

export const COLLECTIONS_STORAGE_KEY = "collections:data";
export const FAVOURITES_COLLECTION_ID = "favourites";
