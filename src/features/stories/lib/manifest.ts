"use client";

import { useEffect, useState } from "react";
import type { StoriesManifest } from "@/lib/types";

export const STORIES_MANIFEST_URL = "/data/stories/manifest.json";
const EMPTY: StoriesManifest = { stories: [], pending: [], builtAt: "" };
let cached: StoriesManifest | null = null;

export async function loadStoriesManifest(): Promise<StoriesManifest> {
  if (cached) return cached;
  try {
    const res = await fetch(STORIES_MANIFEST_URL);
    if (!res.ok) return EMPTY;
    const m = (await res.json()) as StoriesManifest;
    cached = m;
    return m;
  } catch {
    return EMPTY;
  }
}

/** `null` while loading. Loaded once per session. */
export function useStoriesManifest(): StoriesManifest | null {
  const [manifest, setManifest] = useState<StoriesManifest | null>(cached);
  useEffect(() => {
    let alive = true;
    void loadStoriesManifest().then((m) => {
      if (alive) setManifest(m);
    });
    return () => {
      alive = false;
    };
  }, []);
  return manifest;
}
