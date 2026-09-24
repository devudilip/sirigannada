import { DATA_CACHE } from "@/lib/cacheNames";
import type { OfflineWarmProgress } from "../types";

export const BOOKS_MANIFEST_URL = "/data/books/manifest.json";

export function bookJsonUrl(slug: string): string {
  return `/data/books/${slug}.json`;
}

/** The full-corpus word index behind /search: a small meta file plus one shard per first letter. */
export const SEARCH_INDEX_URL = "/data/search/index.json";

export function searchShardUrl(key: string): string {
  return `/data/search/${key}.json`;
}

/** Shard keys from the search meta, or none if it can't be fetched (offline, not built). */
export async function loadSearchShardKeys(): Promise<string[]> {
  try {
    const res = await fetch(SEARCH_INDEX_URL);
    const meta = res.ok ? ((await res.json()) as { shards?: unknown }) : null;
    return Array.isArray(meta?.shards) ? meta.shards.filter((k): k is string => typeof k === "string") : [];
  } catch {
    return [];
  }
}

/** Everything "save books offline" stores: manifest, each book, and the whole search index. */
export function bookCacheUrls(slugs: string[], searchShards: readonly string[] = []): string[] {
  return [BOOKS_MANIFEST_URL, ...slugs.map(bookJsonUrl), SEARCH_INDEX_URL, ...searchShards.map(searchShardUrl)];
}

export function slugFromBookUrl(url: string): string | null {
  const slug = url.match(/\/data\/books\/([^/]+)\.json$/)?.[1];
  if (!slug || slug === "manifest") return null;
  return slug;
}

type CacheLike = { put: (request: RequestInfo, response: Response) => Promise<void> };

/** Fetch each URL into the cache. One failure does not stop the rest. */
export async function putEachUrl(
  cache: CacheLike,
  urls: string[],
  load: (url: string) => Promise<Response>,
  onProgress: (done: number, total: number) => void,
): Promise<string[]> {
  const failed: string[] = [];
  const total = urls.length;
  let done = 0;
  for (const url of urls) {
    try {
      const res = await load(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await cache.put(url, res);
    } catch {
      failed.push(url);
    }
    done += 1;
    onProgress(done, total);
  }
  return failed;
}

export async function warmBookCache(
  slugs: string[],
  onProgress: (p: OfflineWarmProgress) => void,
): Promise<OfflineWarmProgress> {
  const urls = bookCacheUrls(slugs, await loadSearchShardKeys());
  const cache = await caches.open(DATA_CACHE);
  const failedUrls = await putEachUrl(cache, urls, (url) => fetch(url), (done, total) => {
    onProgress({ done, total, failedUrls: [] });
  });
  const result: OfflineWarmProgress = { done: urls.length, total: urls.length, failedUrls };
  onProgress(result);
  return result;
}
