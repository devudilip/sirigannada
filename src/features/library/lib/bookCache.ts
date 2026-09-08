"use client";

import { useEffect, useState } from "react";
import { DATA_CACHE } from "@/lib/cacheNames";
import { bookJsonUrl, slugFromBookUrl } from "./warmBookCache";

/**
 * Slugs whose book JSON is already in the data cache. Empty set when the Cache API is missing
 * (SSR, private mode) so callers simply show "not on device".
 */
export async function cachedBookSlugs(slugs: readonly string[]): Promise<Set<string>> {
  const cached = new Set<string>();
  if (typeof caches === "undefined") return cached;
  try {
    const cache = await caches.open(DATA_CACHE);
    const keys = await cache.keys();
    const wanted = new Set(slugs.map(bookJsonUrl));
    for (const request of keys) {
      const path = new URL(request.url).pathname;
      if (!wanted.has(path)) continue;
      const slug = slugFromBookUrl(path);
      if (slug) cached.add(slug);
    }
  } catch {
    /* cache unavailable — treat as nothing on device */
  }
  return cached;
}

/** `null` until the cache has been read once on the client; then the set of on-device slugs. */
export function useCachedBooks(slugs: readonly string[] | undefined): Set<string> | null {
  const [cached, setCached] = useState<Set<string> | null>(null);
  const key = slugs?.join("|") ?? "";
  useEffect(() => {
    if (!key) return;
    let alive = true;
    void cachedBookSlugs(key.split("|")).then((set) => {
      if (alive) setCached(set);
    });
    return () => {
      alive = false;
    };
  }, [key]);
  return cached;
}
