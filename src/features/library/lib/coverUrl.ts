import type { BookMeta } from "@/lib/types";

/**
 * Public path of a cover photograph. Covers are served from /data/, which the service worker
 * caches cache-first (see public/sw.js), so a saved book keeps its cover offline.
 */
export function coverUrl(file: string): string {
  // Replacing an immutable cached asset needs a new URL, without clearing saved books.
  const revision = file === "aluru-karnataka-gatavaibhava.webp" ? "?v=20261105" : "";
  return `/data/covers/${file}${revision}`;
}

/** Alt text for a cover: what the photograph shows, in the reader's language. */
export function coverAlt(book: BookMeta, locale: "kn" | "en"): string {
  return book.cover ? book.cover.alt[locale] : "";
}
