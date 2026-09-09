"use client";

import { useEffect, useState } from "react";
import type { Story } from "@/lib/types";
import { DATA_CACHE } from "@/lib/cacheNames";
import { STORIES_MANIFEST_URL } from "./manifest";

/** Every URL a story needs offline: its audio and art (text lives in the manifest). */
export function storyCacheUrls(story: Story): string[] {
  return [story.audio, story.art].filter((u): u is string => Boolean(u));
}

export function storiesCacheUrls(stories: readonly Story[]): string[] {
  return [STORIES_MANIFEST_URL, ...stories.flatMap(storyCacheUrls)];
}

function cacheApi(): CacheStorage | null {
  return typeof window !== "undefined" && "caches" in window ? window.caches : null;
}

/** True when the story's audio is fully cached (whole 200 response, so it can play and seek offline). */
export async function isStoryCached(story: Story): Promise<boolean> {
  const caches = cacheApi();
  if (!caches || !story.audio) return false;
  try {
    const cache = await caches.open(DATA_CACHE);
    const hit = await cache.match(story.audio, { ignoreVary: true });
    return Boolean(hit && hit.status === 200);
  } catch {
    return false;
  }
}

/** Bytes of the cached audio, from Content-Length, or 0 when unknown. */
export async function cachedStoryBytes(story: Story): Promise<number> {
  const caches = cacheApi();
  if (!caches || !story.audio) return 0;
  try {
    const cache = await caches.open(DATA_CACHE);
    const hit = await cache.match(story.audio, { ignoreVary: true });
    return hit ? Number(hit.headers.get("content-length") ?? 0) : 0;
  } catch {
    return 0;
  }
}

/** Fetch the whole audio file (no Range header) and store it. Resolves true on success. */
export async function saveStoryOffline(story: Story): Promise<boolean> {
  const caches = cacheApi();
  if (!caches) return false;
  try {
    const cache = await caches.open(DATA_CACHE);
    for (const url of storyCacheUrls(story)) {
      const res = await fetch(url, { cache: "no-store" });
      if (res.status !== 200) return false;
      await cache.put(url, res);
    }
    return true;
  } catch {
    return false;
  }
}

export async function removeStoryOffline(story: Story): Promise<void> {
  const caches = cacheApi();
  if (!caches) return;
  const cache = await caches.open(DATA_CACHE);
  for (const url of storyCacheUrls(story)) await cache.delete(url, { ignoreVary: true });
}

/** Re-checks on mount and whenever `tick` changes (bump it after a save). `null` = unknown yet. */
export function useStoryCached(story: Story | null, tick = 0): boolean | null {
  const [cached, setCached] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    if (!story) {
      setCached(null);
      return;
    }
    void isStoryCached(story).then((v) => {
      if (alive) setCached(v);
    });
    return () => {
      alive = false;
    };
  }, [story, tick]);
  return cached;
}
