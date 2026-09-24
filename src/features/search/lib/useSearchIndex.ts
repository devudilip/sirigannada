"use client";

import { useEffect, useState } from "react";
import { SEARCH_INDEX_URL } from "@/features/library/lib/warmBookCache";
import type { SearchIndex, SearchIndexFile } from "../types";
import { decodeSearchIndex } from "./searchIndex";

type State = { status: "loading" } | { status: "ready"; index: SearchIndex } | { status: "missing" };

let decoded: SearchIndex | null = null;

/** Loads and decodes /data/search.json once per session (~0.9 MB, ~20 ms to decode). */
export function useSearchIndex(): State {
  const [state, setState] = useState<State>(decoded ? { status: "ready", index: decoded } : { status: "loading" });

  useEffect(() => {
    if (decoded) return;
    let alive = true;
    fetch(SEARCH_INDEX_URL)
      .then((r) => (r.ok ? (r.json() as Promise<SearchIndexFile>) : null))
      .catch(() => null)
      .then((file) => {
        if (file?.v === 1) decoded = decodeSearchIndex(file);
        if (alive) setState(decoded ? { status: "ready", index: decoded } : { status: "missing" });
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
