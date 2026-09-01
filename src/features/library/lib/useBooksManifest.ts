"use client";

import { useEffect, useState } from "react";
import type { BooksManifest } from "@/lib/types";

let cached: BooksManifest | null = null;

/** Loads /data/books/manifest.json once per session. `null` while loading; `[]` books if missing. */
export function useBooksManifest(): BooksManifest | null {
  const [manifest, setManifest] = useState<BooksManifest | null>(cached);

  useEffect(() => {
    if (cached) return;
    let alive = true;
    fetch("/data/books/manifest.json")
      .then((r) => (r.ok ? (r.json() as Promise<BooksManifest>) : { books: [], builtAt: "" }))
      .catch(() => ({ books: [], builtAt: "" }))
      .then((m) => {
        cached = m;
        if (alive) setManifest(m);
      });
    return () => {
      alive = false;
    };
  }, []);

  return manifest;
}
