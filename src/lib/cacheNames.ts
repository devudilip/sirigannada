/**
 * Cache bucket names used by `public/sw.js`.
 * The service worker is plain JS (no build), so the strings are duplicated there.
 * `cacheNames.test.ts` fails if they drift.
 */
export const DATA_CACHE = "sg-data-v5";
export const SHELL_CACHE = "sg-shell-v7";
