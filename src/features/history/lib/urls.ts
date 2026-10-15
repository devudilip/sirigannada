import { LIBRARY_URL } from "@/features/children/lib/sections";

/**
 * Client-safe URLs for ಕರ್ನಾಟಕ ಇತಿಹಾಸ. The slug is "karnataka-itihasa" because "itihasa" alone is
 * already the history book-form chip in the library. The catalogue module reads the filesystem,
 * so components import these helpers instead.
 */
export const HISTORY_SLUG = "karnataka-itihasa";
export const HISTORY_URL = `${LIBRARY_URL}/${HISTORY_SLUG}`;

export function historySeriesUrl(series: string): string {
  return `${HISTORY_URL}/${series}`;
}

export function historyStoryUrl(story: { series: string; slug: string }): string {
  return `${historySeriesUrl(story.series)}/${story.slug}`;
}

/** Where a story's pictures live under public/. */
export function historyImageDir(story: { series: string; slug: string }): string {
  return `/history/${story.series}/${story.slug}/`;
}

/**
 * The index and a series page are listings and keep the app shell; a story is read immersively.
 * Accepts a pathname with or without `.html` or a trailing slash.
 */
export function isHistoryListing(pathname: string): boolean {
  const path = pathname.replace(/(\.html)?\/?$/, "");
  return path === HISTORY_URL || /^\/[^/]+\/[^/]+\/[^/]+$/.test(path) && path.startsWith(`${HISTORY_URL}/`);
}
