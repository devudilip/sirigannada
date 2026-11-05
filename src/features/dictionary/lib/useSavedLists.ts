"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { loadCollectionsData, toggleSavedWord } from "@/features/collections/lib/storage";
import { DICT_FAVOURITES_KEY, DICT_HISTORY_KEY, DICT_HISTORY_LIMIT } from "../types";
import { parseHistory, parseStringList, pushHistory } from "./savedLists";

export function useSavedLists() {
  const [history, setHistory] = useState<string[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    const stored = readStorage<unknown>(DICT_HISTORY_KEY, []);
    const history = parseHistory(stored, DICT_HISTORY_LIMIT);
    // Shrink lists saved under the old, longer cap so storage matches what is shown.
    if (Array.isArray(stored) && stored.length > history.length) writeStorage(DICT_HISTORY_KEY, history);
    setHistory(history);
    loadCollectionsData();
    setFavourites(parseStringList(readStorage<unknown>(DICT_FAVOURITES_KEY, [])));
  }, []);

  const rememberSearch = useCallback((query: string) => {
    setHistory((prev) => {
      const next = pushHistory(prev, query, DICT_HISTORY_LIMIT);
      writeStorage(DICT_HISTORY_KEY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    writeStorage<string[]>(DICT_HISTORY_KEY, []);
    setHistory([]);
  }, []);

  const toggleStar = useCallback((word: string) => {
    setFavourites(toggleSavedWord(word));
  }, []);

  return { history, favourites, rememberSearch, clearHistory, toggleStar };
}
