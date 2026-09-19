"use client";

import { useEffect, useState } from "react";
import type { BooksManifest } from "@/lib/types";

let cached: BooksManifest | null = null;
let inflight: Promise<BooksManifest> | null = null;

/** Loads /data/books/manifest.json once per session. `null` while loading; `[]` books if missing. */
export function useBooksManifest(): BooksManifest | null {
  const [manifest, setManifest] = useState<BooksManifest | null>(cached);

  useEffect(() => {
    if (cached && cached.books.length > 0) {
      setManifest(cached);
      return;
    }
    let alive = true;
    if (!inflight) {
      inflight = fetch("/data/books/manifest.json")
        .then((r) => (r.ok ? (r.json() as Promise<BooksManifest>) : { books: [], builtAt: "" }))
        .catch(() => ({ books: [], builtAt: "" }))
        .finally(() => {
          inflight = null;
        });
    }
    inflight.then((m) => {
      if (m.books.length > 0) cached = m;
      if (alive) setManifest(m);
    });
    return () => {
      alive = false;
    };
  }, []);

  return manifest;
}
