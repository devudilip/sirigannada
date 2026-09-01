"use client";

import { useEffect, useState } from "react";
import { search, type SearchResult } from "./search";

interface SearchState {
  results: SearchResult[];
  loading: boolean;
}

/** Debounced dictionary search. Cancels stale responses so fast typing never shows old results. */
export function useSearch(query: string, delay = 120): SearchState {
  const [state, setState] = useState<SearchState>({ results: [], loading: false });

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState({ results: [], loading: false });
      return;
    }
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    const timer = setTimeout(() => {
      search(q).then((results) => {
        if (alive) setState({ results, loading: false });
      });
    }, delay);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query, delay]);

  return state;
}
