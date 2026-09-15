import type { PictureBookLevel, PictureBookMeta } from "@/lib/types";

export type LevelFilter = "1" | "2" | "3" | "4plus";
export type PicturebookFilter = "all" | LevelFilter | "audio";

const LEVEL_ORDER: readonly LevelFilter[] = ["1", "2", "3", "4plus"];

/** Levels "4" and "5" (StoryWeaver's older-reader tier) share one "4+" chip. */
export function levelBucket(level: PictureBookLevel): LevelFilter {
  return level === "1" || level === "2" || level === "3" ? level : "4plus";
}

/** "all", then only the level buckets present, then "audio" when at least one book has narration. */
export function availableFilters(books: readonly PictureBookMeta[]): PicturebookFilter[] {
  const levels = new Set(books.map((b) => levelBucket(b.level)));
  const out: PicturebookFilter[] = ["all", ...LEVEL_ORDER.filter((l) => levels.has(l))];
  if (books.some((b) => b.audio !== null)) out.push("audio");
  return out;
}

export function filterBooks(books: readonly PictureBookMeta[], filter: PicturebookFilter): PictureBookMeta[] {
  if (filter === "all") return [...books];
  if (filter === "audio") return books.filter((b) => b.audio !== null);
  return books.filter((b) => levelBucket(b.level) === filter);
}

/** Title search in either language; empty query keeps everything. */
export function filterByQuery(books: readonly PictureBookMeta[], query: string): PictureBookMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...books];
  return books.filter((b) => b.title.toLowerCase().includes(q) || (b.titleEn ?? "").toLowerCase().includes(q));
}
