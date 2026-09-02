import type { Book } from "@/lib/types";

/** Canonical origin for shared links. Keep in sync with `SITE_URL` in features/library/lib/siteUrls.ts. */
export const CANONICAL_ORIGIN = "https://sirigannada.in";

const HASH_BLOCK = /^#?b(\d+)$/;

/** Root-relative URL that opens one verse (global block index) inside a book. */
export function versePermalinkPath(slug: string, block: number): string {
  return `/library/${slug}#b${block}`;
}

/** Absolute permalink when `origin` is set (e.g. `window.location.origin`). */
export function versePermalinkUrl(slug: string, block: number, origin = ""): string {
  const path = versePermalinkPath(slug, block);
  if (!origin) return path;
  return `${origin.replace(/\/$/, "")}${path}`;
}

/** Prefer the origin the reader is served from; fall back to the canonical site (file://, null origins). */
export function shareOrigin(pageOrigin: string | null | undefined): string {
  return pageOrigin && /^https?:\/\//.test(pageOrigin) ? pageOrigin : CANONICAL_ORIGIN;
}

/** Block index carried by a `#b<index>` hash, or null for any other hash. */
export function blockFromHash(hash: string): number | null {
  const match = HASH_BLOCK.exec(hash.trim());
  if (!match) return null;
  const block = Number(match[1]);
  return Number.isSafeInteger(block) ? block : null;
}

/** Total blocks in a book — the exclusive upper bound for a permalink index. */
export function blockCount(book: Book): number {
  return book.chapters.reduce((n, ch) => n + ch.blocks.length, 0);
}

/** The block a hash asks for, or null when it is absent, malformed, or past the end of the book. */
export function hashBlock(hash: string, total: number): number | null {
  const block = blockFromHash(hash);
  return block !== null && block < total ? block : null;
}
