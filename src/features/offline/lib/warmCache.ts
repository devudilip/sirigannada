import type { OfflineWarmProgress } from "../types";

type CacheLike = { put: (request: RequestInfo, response: Response) => Promise<void> };

/** Fetch each URL and put it in the cache. One failure does not stop the rest. */
export async function putEachUrl(
  cache: CacheLike,
  urls: readonly string[],
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

/**
 * Generic warm helper for categories with a static URL list (shell routes, proverbs.json).
 * Dictionary and books have their own manifest-driven warmers, reused as-is from their features.
 */
export async function warmUrls(
  cacheName: string,
  urls: readonly string[],
  onProgress: (p: OfflineWarmProgress) => void,
): Promise<OfflineWarmProgress> {
  const cache = await caches.open(cacheName);
  const failedUrls = await putEachUrl(cache, urls, (url) => fetch(url), (done, total) => {
    onProgress({ done, total, failedUrls: [] });
  });
  const result: OfflineWarmProgress = { done: urls.length, total: urls.length, failedUrls };
  onProgress(result);
  return result;
}
