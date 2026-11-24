import { LIBRARY_URL } from "@/features/children/lib/sections";

/**
 * Client-safe URLs for the illustrated non-fiction shelves that share the history reader:
 * ಕರ್ನಾಟಕ ಇತಿಹಾಸ (dynasties and people) and ಕರ್ನಾಟಕ ಸಂಗತಿಗಳು (festivals and other things of the
 * land). The history slug is "karnataka-itihasa" because "itihasa" alone is already the history
 * book-form chip in the library. The catalogue module reads the filesystem, so components import
 * these helpers instead.
 */
export const HISTORY_SLUG = "karnataka-itihasa";
export const SANGATHIGALU_SLUG = "sangathigalu";
export type Shelf = typeof HISTORY_SLUG | typeof SANGATHIGALU_SLUG;
export const SHELVES: readonly Shelf[] = [HISTORY_SLUG, SANGATHIGALU_SLUG];

export const HISTORY_URL = `${LIBRARY_URL}/${HISTORY_SLUG}`;
export const SANGATHIGALU_URL = `${LIBRARY_URL}/${SANGATHIGALU_SLUG}`;

export function shelfUrl(shelf: Shelf = HISTORY_SLUG): string {
  return `${LIBRARY_URL}/${shelf}`;
}

export function historySeriesUrl(series: string, shelf: Shelf = HISTORY_SLUG): string {
  return `${shelfUrl(shelf)}/${series}`;
}

export function historyStoryUrl(story: { series: string; slug: string }, shelf: Shelf = HISTORY_SLUG): string {
  return `${historySeriesUrl(story.series, shelf)}/${story.slug}`;
}

/** Where a story's pictures live under public/. */
export function historyImageDir(story: { series: string; slug: string }): string {
  return `/history/${story.series}/${story.slug}/`;
}

/**
 * The index and a series page of either shelf are listings and keep the app shell; a story is
 * read immersively. Accepts a pathname with or without `.html` or a trailing slash.
 */
export function isHistoryListing(pathname: string): boolean {
  const path = pathname.replace(/(\.html)?\/?$/, "");
  return SHELVES.some((shelf) => {
    const root = shelfUrl(shelf);
    return path === root || (/^\/[^/]+\/[^/]+\/[^/]+$/.test(path) && path.startsWith(`${root}/`));
  });
}
