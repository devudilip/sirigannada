import { readStorage, writeStorage } from "@/lib/storage";

export interface PicturebookProgress {
  page: number;
  pageCount: number;
  updatedAt: number;
}

const key = (slug: string): string => `picturebook:progress:${slug}`;

export function readProgress(slug: string): PicturebookProgress | null {
  return readStorage<PicturebookProgress | null>(key(slug), null);
}

/** `page` is 0-based, including the cover (0) and the attribution page (pageCount - 1). */
export function writeProgress(slug: string, page: number, pageCount: number, now = Date.now()): void {
  writeStorage<PicturebookProgress>(key(slug), { page, pageCount, updatedAt: now });
}

export function clearProgress(slug: string): void {
  writeStorage<PicturebookProgress | null>(key(slug), null);
}

/** Where to resume `slug`: the saved page, or 0 (the cover) when nothing saved or the book is finished. */
export function resumePage(saved: PicturebookProgress | null): number {
  if (!saved) return 0;
  if (saved.pageCount > 0 && saved.page >= saved.pageCount - 1) return 0;
  return saved.page;
}

/** The most recently opened, unfinished book among `slugs` — feeds the hub's Continue card. */
export function pickContinue(
  slugs: readonly string[],
  read: (slug: string) => PicturebookProgress | null = readProgress,
): { slug: string; progress: PicturebookProgress } | null {
  let best: { slug: string; progress: PicturebookProgress } | null = null;
  for (const slug of slugs) {
    const progress = read(slug);
    if (!progress || resumePage(progress) === 0) continue;
    if (!best || progress.updatedAt > best.progress.updatedAt) best = { slug, progress };
  }
  return best;
}
