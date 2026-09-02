"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { DICT_FAVOURITES_KEY, DICT_HISTORY_KEY, DICT_HISTORY_LIMIT } from "../types";
import { parseStringList, pushHistory, toggleFavourite } from "./savedLists";

export function useSavedLists() {
  const [history, setHistory] = useState<string[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    setHistory(parseStringList(readStorage<unknown>(DICT_HISTORY_KEY, [])));
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
    setFavourites((prev) => {
      const next = toggleFavourite(prev, word);
      writeStorage(DICT_FAVOURITES_KEY, next);
      return next;
    });
  }, []);

  return { history, favourites, rememberSearch, clearHistory, toggleStar };
}
