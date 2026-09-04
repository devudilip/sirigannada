"use client";

import { useCallback, useEffect, useState } from "react";
import type { CollectionItemInput, CollectionsData, CollectionsExport } from "../types";
import {
  addItem,
  collectionsContaining,
  createCollection,
  deleteCollection,
  emptyCollectionsData,
  exportCollections,
  isSaved,
  makeId,
  mergeImport,
  removeItem,
  renameCollection,
  setItemNote,
  toggleFavourite,
} from "./collections";
import { loadCollectionsData, saveCollectionsData } from "./storage";

/** Single source of truth for the collections feature. Loads from localStorage once, mutates in place. */
export function useCollections() {
  const [data, setData] = useState<CollectionsData>(emptyCollectionsData());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadCollectionsData());
    setLoaded(true);
  }, []);

  const commit = useCallback((next: CollectionsData) => {
    setData(next);
    saveCollectionsData(next);
  }, []);

  const create = useCallback((name: string) => commit(createCollection(data, name)), [commit, data]);
  const rename = useCallback((id: string, name: string) => commit(renameCollection(data, id, name)), [commit, data]);
  const remove = useCallback((id: string) => commit(deleteCollection(data, id)), [commit, data]);

  const save = useCallback(
    (collectionId: string, item: CollectionItemInput, note?: string) => commit(addItem(data, collectionId, item, note)),
    [commit, data],
  );
  const saveToNewCollection = useCallback(
    (name: string, item: CollectionItemInput) => {
      const id = makeId();
      const withCollection = createCollection(data, name, Date.now(), id);
      if (withCollection === data) return; // blank name, no-op
      commit(addItem(withCollection, id, item));
    },
    [commit, data],
  );
  const unsave = useCallback(
    (collectionId: string, item: CollectionItemInput) => commit(removeItem(data, collectionId, item)),
    [commit, data],
  );
  const setNote = useCallback(
    (collectionId: string, item: CollectionItemInput, note: string) => commit(setItemNote(data, collectionId, item, note)),
    [commit, data],
  );
  const toggle = useCallback((item: CollectionItemInput) => commit(toggleFavourite(data, item)), [commit, data]);

  const exportJson = useCallback((ids?: readonly string[]) => exportCollections(data, ids), [data]);
  const importJson = useCallback((imported: CollectionsExport) => commit(mergeImport(data, imported)), [commit, data]);

  return {
    data,
    loaded,
    collections: data.collections,
    create,
    rename,
    remove,
    save,
    saveToNewCollection,
    unsave,
    setNote,
    toggle,
    isSaved: useCallback((item: CollectionItemInput) => isSaved(data, item), [data]),
    collectionsContaining: useCallback((item: CollectionItemInput) => collectionsContaining(data, item), [data]),
    exportJson,
    importJson,
  };
}
