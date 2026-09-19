import type { BookMeta } from "@/lib/types";

/**
 * Public path of a cover photograph. Covers are served from /data/, which the service worker
 * caches cache-first (see public/sw.js), so a saved book keeps its cover offline.
 */
export function coverUrl(file: string): string {
  return `/data/covers/${file}`;
}

/** Alt text for a cover: what the photograph shows, in the reader's language. */
export function coverAlt(book: BookMeta, locale: "kn" | "en"): string {
  return book.cover ? book.cover.alt[locale] : "";
}
