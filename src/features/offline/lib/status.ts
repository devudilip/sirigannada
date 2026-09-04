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
  try {
    const cache = await caches.open(cacheNameFor(id));
    const keys = await cache.keys();
    const cachedPaths = new Set(keys.map((r) => new URL(r.url).pathname));
    const { cachedCount, totalCount, missingUrls } = computeReadiness(expectedUrls, cachedPaths);
    // The shell bucket also contains runtime JS, CSS, fonts, and icons. Count all of it so the
    // storage figure matches what Clear removes. Data categories share one bucket, so each one
    // continues to count only its own manifest-derived URLs.
    const entries: readonly (Request | string)[] = id === "shell" ? keys : expectedUrls.filter((url) => cachedPaths.has(url));
    const bytes = await sumCachedBytes(cache, entries);
    return { id, cachedCount, totalCount, bytes, missingUrls, unavailable: false };
  } catch {
    return { id, cachedCount: 0, totalCount: expectedUrls.length, bytes: 0, missingUrls: expectedUrls, unavailable: true };
  }
}

async function sumCachedBytes(cache: Cache, entries: readonly (Request | string)[]): Promise<number> {
  let total = 0;
  for (const entry of entries) {
    const res = await cache.match(entry);
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

/** Removes a category. Shell owns its bucket; data categories share theirs and delete by URL. */
export async function clearCategoryCache(id: OfflineCategoryId, urls: string[]): Promise<void> {
  if (typeof caches === "undefined") return;
  if (id === "shell") {
    await caches.delete(SHELL_CACHE);
    return;
  }
  const cache = await caches.open(cacheNameFor(id));
  await Promise.all(urls.map((url) => cache.delete(url)));
}
