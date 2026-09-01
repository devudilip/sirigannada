/*
 * Sirigannada service worker — hand-written, no build step.
 *
 * Strategy:
 *  - App shell (HTML, JS, CSS, fonts, icons): stale-while-revalidate. Fast, and updates in the background.
 *  - Data (/data/**): cache-first. Dictionary shards and books never change once built; a new
 *    deploy bumps DATA_VERSION which starts a fresh cache and drops the old one.
 *  - Navigation fallback: if offline and the page is not cached, serve the cached home page.
 */
const SHELL_CACHE = "sg-shell-v1";
const DATA_CACHE = "sg-data-v1";
const PRECACHE = ["/", "/dictionary", "/library", "/about", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
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
    event.respondWith(cacheFirst(request, DATA_CACHE));
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
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
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
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return (await cache.match(request)) || (await cache.match("/")) || Response.error();
  }
}
