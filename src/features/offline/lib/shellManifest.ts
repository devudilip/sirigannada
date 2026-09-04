/**
 * Mirrors `PRECACHE_SHELL` in `public/sw.js`. The service worker is a plain script (no build
 * step, no exports), so this list is hand-duplicated here for the offline manager page.
 * `shellManifest.test.ts` fails if the two drift apart.
 */
export const SHELL_PRECACHE_ROUTES: readonly string[] = [
  "/",
  "/dictionary",
  "/library",
  "/about",
  "/credits",
  "/tools",
  "/tools/transliterate",
  "/tools/numbers",
  "/tools/convert",
  "/tools/text-health",
  "/tools/offline",
  "/collections",
  "/learn",
  "/learn/alphabet",
  "/learn/practice",
  "/proverbs",
  "/manifest.webmanifest",
  "/favicon.svg",
];
