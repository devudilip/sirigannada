import { DATA_CACHE, SHELL_CACHE } from "@/lib/cacheNames";
import type { OfflineCategoryId, OfflineCategoryStatus } from "../types";
import { computeReadiness } from "./readiness";

/** SHELL_CACHE holds shell routes; DATA_CACHE holds dictionary/books/proverbs. */
export function cacheNameFor(id: OfflineCategoryId): string {
  return id === "shell" ? SHELL_CACHE : DATA_CACHE;
}

/**
 * Reads the live Cache API state for one category. Not unit-tested — the Cache API needs a real
 * browser — but it only orchestrates `caches.*` calls around the pure `computeReadiness` above.
 */
export async function loadCategoryStatus(id: OfflineCategoryId, expectedUrls: string[]): Promise<OfflineCategoryStatus> {
  if (typeof caches === "undefined") {
    return { id, cachedCount: 0, totalCount: expectedUrls.length, bytes: 0, missingUrls: expectedUrls, unavailable: true };
  }
  const cache = await caches.open(cacheNameFor(id));
  const keys = await cache.keys();
  const cachedPaths = new Set(keys.map((r) => new URL(r.url).pathname));
  const { cachedCount, totalCount, missingUrls } = computeReadiness(expectedUrls, cachedPaths);
  const bytes = await sumCachedBytes(cache, expectedUrls, cachedPaths);
  return { id, cachedCount, totalCount, bytes, missingUrls, unavailable: false };
}

async function sumCachedBytes(cache: Cache, expectedUrls: string[], cachedPaths: Set<string>): Promise<number> {
  let total = 0;
  for (const url of expectedUrls) {
    if (!cachedPaths.has(url)) continue;
    const res = await cache.match(url);
    if (!res) continue;
    const contentLength = res.headers.get("content-length");
    if (contentLength) {
      total += Number(contentLength) || 0;
      continue;
    }
    try {
      total += (await res.clone().blob()).size;
    } catch {
      // Body already consumed or unreadable — skip rather than fail the whole tally.
    }
  }
  return total;
}

/** Removes every expected URL for a category from its cache bucket. */
export async function clearCategoryCache(id: OfflineCategoryId, urls: string[]): Promise<void> {
  if (typeof caches === "undefined") return;
  const cache = await caches.open(cacheNameFor(id));
  await Promise.all(urls.map((url) => cache.delete(url)));
}
