import type { DictManifest } from "@/lib/types";
import { DATA_CACHE } from "@/lib/cacheNames";
import type { DictOfflineWarmProgress } from "../types";
import { loadManifest } from "./data";

const DICT_BASE = "/data/dict";
const DICT_MANIFEST_URL = `${DICT_BASE}/manifest.json`;

export function dictionaryCacheUrls(manifest: DictManifest): string[] {
  const files = new Set<string>([
    "manifest.json",
    ...manifest.shards.map((s) => s.file),
    ...manifest.reverseShards.map((s) => s.file),
  ]);
  return [...files].map((file) => `${DICT_BASE}/${file}`);
}

type CacheLike = { put: (request: RequestInfo, response: Response) => Promise<void> };

async function putEachUrl(
  cache: CacheLike,
  urls: string[],
  onProgress: (done: number, total: number) => void,
): Promise<string[]> {
  const failed: string[] = [];
  const total = urls.length;
  let done = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url);
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

export async function warmDictionaryCache(
  onProgress: (p: DictOfflineWarmProgress) => void,
): Promise<DictOfflineWarmProgress> {
  const manifest = await loadManifest();
  const urls = manifest ? dictionaryCacheUrls(manifest) : [DICT_MANIFEST_URL];
  const cache = await caches.open(DATA_CACHE);
  const failedUrls = await putEachUrl(cache, urls, (done, total) => {
    onProgress({ done, total, failedUrls: [] });
  });
  const result: DictOfflineWarmProgress = { done: urls.length, total: urls.length, failedUrls };
  onProgress(result);
  return result;
}
