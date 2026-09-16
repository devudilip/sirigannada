/**
 * Mirrors `PRECACHE_SHELL` in `public/sw.js`. The service worker is a plain script (no build
 * step, no exports), so this list is hand-duplicated here for the offline manager page.
 * `shellManifest.test.ts` fails if the two drift apart.
 *
 * Only core routes are precached; other pages (about, credits, contact, tools, learn) are cached
 * on first visit by the service worker's navigation handler, so recently opened pages work
 * offline without bloating the install (see the 2 MB budget in scripts/check-bundle.ts).
 */
export const SHELL_PRECACHE_ROUTES: readonly string[] = [
  "/",
  "/dictionary",
  "/library",
  "/proverbs",
  "/collections",
  "/learn/practice",
  "/games",
  "/games/word",
  "/games/padabandha",
  "/stories",
  "/picturebooks",
  "/more",
  "/tools/offline",
  "/manifest.webmanifest",
  "/favicon.svg",
];
