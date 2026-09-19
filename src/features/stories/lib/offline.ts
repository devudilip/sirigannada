"use client";

import { useEffect, useState } from "react";
import type { Story } from "@/lib/types";
import { DATA_CACHE, SHELL_CACHE } from "@/lib/cacheNames";
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

/** The story's pages, so the player and read-along open with the network off. */
export function storyPageUrls(story: Story): string[] {
  const pages = [`/stories/${story.slug}`];
  if (story.sentences) pages.push(`/stories/${story.slug}/read`);
  return pages;
}

/**
 * Fetch the whole audio file (no Range header) and store it, then warm the story's pages into
 * the shell cache. Resolves true when the audio is stored; a page miss is not fatal.
 */
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
    const shell = await caches.open(SHELL_CACHE);
    for (const url of storyPageUrls(story)) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const html = await res.clone().text();
        await shell.put(url, res);
        // The page's own scripts and styles, or a chunk-load error would reload the page offline.
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

/** `/_next/static/...` script and stylesheet URLs referenced by a prerendered page. */
export function pageAssetUrls(html: string): string[] {
  const out = new Set<string>();
  const re = /(?:src|href)="(\/_next\/static\/[^"]+\.(?:js|css))"/g;
  for (const m of html.matchAll(re)) out.add(m[1] ?? "");
  out.delete("");
  return [...out];
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
