"use client";

import { useEffect, useState } from "react";
import { loadProverbs } from "@/features/proverbs/lib/load";
import type { Proverb } from "@/features/proverbs/types";

let cached: Map<string, Proverb> | null = null;

/** Loads /data/proverbs.json once and indexes it by id, so a saved proverb item can show its text. */
export function useProverbLookup(): Map<string, Proverb> | null {
  const [index, setIndex] = useState<Map<string, Proverb> | null>(cached);

  useEffect(() => {
    if (cached) {
      setIndex(cached);
      return;
    }
    let alive = true;
    loadProverbs().then((file) => {
      const map = new Map<string, Proverb>();
      for (const p of file?.proverbs ?? []) if (p.id) map.set(p.id, p);
      cached = map;
      if (alive) setIndex(map);
    });
    return () => {
      alive = false;
    };
  }, []);

  return index;
}
