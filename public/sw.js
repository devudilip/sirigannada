/*
 * Sirigannada service worker — hand-written, no build step.
 *
 * Strategy:
 *  - App shell (HTML, JS, CSS, fonts, icons): stale-while-revalidate. Fast, and updates in the background.
 *    Only the core routes (home, dictionary, library, proverbs, games, hubs, offline manager) are
 *    precached at install; every other page is cached the first time it is opened, so recently
 *    visited pages work offline and the rest need the network once.
 *  - Data (/data/**): cache-first. Dictionary shards, book text, images and audio never change
 *    once built. The catalogue files in PRECACHE_DATA (manifests, proverbs, game data) DO change
 *    on every content deploy, so they are stale-while-revalidate in the same cache: instant
 *    from cache, refreshed in the background, new books visible on the next open. Bumping
 *    DATA_CACHE is reserved for format changes, since it drops everything saved for offline.
 *  - Navigation fallback: if offline and the page is not cached, serve the cached home page.
 */
const SHELL_CACHE = "sg-shell-v12";
// Keep DATA_CACHE in lockstep with src/lib/cacheNames.ts (enforced by cacheNames.test.ts).
const DATA_CACHE = "sg-data-v5";
const PRECACHE_SHELL = ["/", "/dictionary", "/library", "/proverbs", "/collections", "/learn/practice", "/games", "/games/word", "/games/padabandha", "/stories", "/picturebooks", "/more", "/tools/offline", "/manifest.webmanifest", "/favicon.svg"];
const PRECACHE_DATA = ["/data/books/manifest.json", "/data/dict/manifest.json", "/data/dict/wordgame.json", "/data/dict/padabandha.json", "/data/proverbs.json", "/data/stories/manifest.json", "/data/picturebooks/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_SHELL).catch(() => undefined)),
      caches.open(DATA_CACHE).then(async (cache) => {
        await cache.delete("/data/dict/wordgame-5.json");
        return cache.addAll(PRECACHE_DATA).catch(() => undefined);
      }),
    ])
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== DATA_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/data/")) {
    const isCatalogue = PRECACHE_DATA.includes(url.pathname);
    event.respondWith(isCatalogue ? staleWhileRevalidate(request, DATA_CACHE) : cacheFirst(request, DATA_CACHE));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreVary: true });
  const range = request.headers.get("range");
  if (hit) return range ? await sliceRange(hit, range) : hit;
  const res = await fetch(request);
  // Audio elements ask for byte ranges (206); only whole files (200) go in the cache.
  if (res.status === 200) cache.put(request, res.clone());
  return res;
}

/** Answer a Range request from a fully cached response so cached audio can seek offline. */
async function sliceRange(full, rangeHeader) {
  const buf = await full.clone().arrayBuffer();
  const total = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!m) return full;
  const start = m[1] === "" ? Math.max(0, total - Number(m[2])) : Number(m[1]);
  const end = m[2] === "" || m[1] === "" ? total - 1 : Math.min(total - 1, Number(m[2]));
  if (start > end || start >= total) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
  const headers = new Headers(full.headers);
  headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Accept-Ranges", "bytes");
  return new Response(buf.slice(start, end + 1), { status: 206, headers });
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const refresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => hit);
  return hit || refresh;
}

async function networkFirstWithFallback(request) {
  const cache = await caches.open(SHELL_CACHE);
  // Pages are static HTML; the query string (e.g. ?q=word) is handled client-side, so cache by path.
  const key = new URL(request.url);
  key.search = "";
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(key.href, res.clone());
    return res;
  } catch {
    return (await cache.match(key.href, { ignoreSearch: true })) || (await cache.match("/")) || Response.error();
  }
}
