"use client";

import { useEffect, useState } from "react";
import type { PictureBook, PictureBooksManifest } from "@/lib/types";

export const PICTUREBOOKS_MANIFEST_URL = "/data/picturebooks/manifest.json";
const EMPTY: PictureBooksManifest = { books: [], builtAt: "" };
let cached: PictureBooksManifest | null = null;
const bookCache = new Map<string, PictureBook>();

export async function loadPicturebooksManifest(): Promise<PictureBooksManifest> {
  if (cached) return cached;
  try {
    const res = await fetch(PICTUREBOOKS_MANIFEST_URL);
    if (!res.ok) return EMPTY;
    const m = (await res.json()) as PictureBooksManifest;
    cached = m;
    return m;
  } catch {
    return EMPTY;
  }
}

/** `null` while loading. Loaded once per session. */
export function usePicturebooksManifest(): PictureBooksManifest | null {
  const [manifest, setManifest] = useState<PictureBooksManifest | null>(cached);
  useEffect(() => {
    let alive = true;
    void loadPicturebooksManifest().then((m) => {
      if (alive) setManifest(m);
    });
    return () => {
      alive = false;
    };
  }, []);
  return manifest;
}

export function bookUrl(slug: string): string {
  return `/data/picturebooks/${slug}.json`;
}

export async function loadPicturebook(slug: string): Promise<PictureBook | null> {
  const hit = bookCache.get(slug);
  if (hit) return hit;
  try {
    const res = await fetch(bookUrl(slug));
    if (!res.ok) return null;
    const book = (await res.json()) as PictureBook;
    bookCache.set(slug, book);
    return book;
  } catch {
    return null;
  }
}

/** `undefined` while loading, `null` when the slug does not resolve to a book. */
export function usePicturebook(slug: string): PictureBook | null | undefined {
  const [book, setBook] = useState<PictureBook | null | undefined>(bookCache.get(slug));
  useEffect(() => {
    let alive = true;
    setBook(bookCache.get(slug));
    void loadPicturebook(slug).then((b) => {
      if (alive) setBook(b);
    });
    return () => {
      alive = false;
    };
  }, [slug]);
  return book;
}
