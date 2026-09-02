"use client";

import { useEffect, useState } from "react";
import { search, type SearchResult } from "./search";
import { suggestionsFor } from "./suggest";

interface SearchState {
  results: SearchResult[];
  suggestions: string[];
  loading: boolean;
}

const EMPTY: SearchState = { results: [], suggestions: [], loading: false };

/** Debounced dictionary search. Cancels stale responses so fast typing never shows old results. */
export function useSearch(query: string, delay = 120): SearchState {
  const [state, setState] = useState<SearchState>(EMPTY);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState(EMPTY);
      return;
    }
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    const timer = setTimeout(() => {
      search(q).then(async (results) => {
        if (!alive) return;
        const suggestions = results.length === 0 ? await suggestionsFor(q) : [];
        if (alive) setState({ results, suggestions, loading: false });
      });
    }, delay);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query, delay]);

  return state;
}
