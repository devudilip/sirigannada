"use client";

import { useEffect, useState } from "react";
import type { PictureBook } from "@/lib/types";
import { DATA_CACHE, SHELL_CACHE } from "@/lib/cacheNames";
import { pageAssetUrls } from "@/features/stories/lib/offline";
import { bookUrl } from "./manifest";

/** Every URL a book needs offline: its JSON, cover, page images and (when present) audio. */
export function bookCacheUrls(book: PictureBook): string[] {
  const urls = [bookUrl(book.slug), book.cover.src];
  for (const page of book.pages) if (page.image) urls.push(page.image.src);
  if (book.audio) urls.push(book.audio.src);
  return urls;
}

export function bookPageUrls(slug: string): string[] {
  return [`/picturebooks/${slug}`];
}

function cacheApi(): CacheStorage | null {
  return typeof window !== "undefined" && "caches" in window ? window.caches : null;
}

/** True when the book's own JSON is fully cached — the signal that "save on device" ran. */
export async function isBookCached(slug: string): Promise<boolean> {
  const caches = cacheApi();
  if (!caches) return false;
  try {
    const cache = await caches.open(DATA_CACHE);
    const hit = await cache.match(bookUrl(slug), { ignoreVary: true });
    return Boolean(hit && hit.status === 200);
  } catch {
    return false;
  }
}

/**
 * Fetch the book's data (JSON, cover, pages, audio) and store it, then warm the reader page into
 * the shell cache. Resolves true when the data is stored; a page miss is not fatal.
 */
export async function saveBookOffline(book: PictureBook): Promise<boolean> {
  const caches = cacheApi();
  if (!caches) return false;
  try {
    const cache = await caches.open(DATA_CACHE);
    for (const url of bookCacheUrls(book)) {
      const res = await fetch(url, { cache: "no-store" });
      if (res.status !== 200) return false;
      await cache.put(url, res);
    }
    const shell = await caches.open(SHELL_CACHE);
    for (const url of bookPageUrls(book.slug)) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const html = await res.clone().text();
        await shell.put(url, res);
        for (const asset of pageAssetUrls(html)) {
          if (await shell.match(asset)) continue;
          const a = await fetch(asset);
          if (a.ok) await shell.put(asset, a);
        }
      } catch {
        /* page stays network-only */
      }
    }
    return true;
  } catch {
    return false;
  }
}

export async function removeBookOffline(book: PictureBook): Promise<void> {
  const caches = cacheApi();
  if (!caches) return;
  const cache = await caches.open(DATA_CACHE);
  for (const url of bookCacheUrls(book)) await cache.delete(url, { ignoreVary: true });
}

/** Re-checks on mount and whenever `tick` changes (bump it after a save). `null` = unknown yet. */
export function useBookCached(slug: string | null, tick = 0): boolean | null {
  const [cached, setCached] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    if (!slug) {
      setCached(null);
      return;
    }
    void isBookCached(slug).then((v) => {
      if (alive) setCached(v);
    });
    return () => {
      alive = false;
    };
  }, [slug, tick]);
  return cached;
}
