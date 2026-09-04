"use client";

import { useEffect, useState } from "react";
import { loadProverbs } from "./load";
import type { Proverb } from "../types";

let cached: Proverb[] | null = null;

/**
 * Loads /data/proverbs.json once and caches the full list in memory for the session.
 * Used where a feature needs to scan every proverb (e.g. the reader's context lens
 * matching a tapped word against proverb text) rather than look one up by id.
 */
export function useProverbs(): Proverb[] | null {
  const [list, setList] = useState<Proverb[] | null>(cached);

  useEffect(() => {
    if (cached) {
      setList(cached);
      return;
    }
    let alive = true;
    loadProverbs().then((file) => {
      const proverbs = file?.proverbs ?? [];
      cached = proverbs;
      if (alive) setList(proverbs);
    });
    return () => {
      alive = false;
    };
  }, []);

  return list;
}
