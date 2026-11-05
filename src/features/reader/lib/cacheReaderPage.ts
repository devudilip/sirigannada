import { SHELL_CACHE } from "@/lib/cacheNames";

type PageCache = { put: (url: string, response: Response) => Promise<void> };

/** Client navigation fetches RSC, not a document. Save the document too so an offline reload
 * can open a visited reader instead of receiving the service worker's home-page fallback. */
export async function saveReaderDocument(
  slug: string,
  cache: PageCache,
  load: (url: string) => Promise<Response>,
): Promise<void> {
  const url = `/library/${encodeURIComponent(slug)}`;
  try {
    const response = await load(url);
    if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
      await cache.put(url, response);
    }
  } catch {
    // A failed warm-up must never interrupt a book already available on this device.
  }
}

export async function cacheReaderPage(slug: string): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(SHELL_CACHE);
    await saveReaderDocument(slug, cache, (url) => fetch(url, { headers: { Accept: "text/html" } }));
  } catch {
    // Cache Storage can be unavailable in private browsing.
  }
}
