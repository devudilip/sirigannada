import { readStorage } from "@/lib/storage";
import { readProgress } from "@/features/reader/lib/settings";
import { loadCollectionsData } from "@/features/collections/lib/storage";
import { FAVOURITES_COLLECTION_ID } from "@/features/collections/types";
import { BEGINNER_PADABANDHA } from "@/features/padabandha/data/puzzles";
import { parseStoredValues } from "@/features/padabandha/lib/puzzle";
import { dateKey } from "@/features/games/lib/wordGameDay";
import { CONTINUE_TTL_MS } from "./blobCodec";
import type { ProgressBlob } from "../types";

/** Keep the link short: only the most recent stars travel. */
const STAR_CAP = 200;

interface BuildOptions {
  /** Reader passes its open book so the exact page travels even before progress is re-saved. */
  current?: { bookId: string; verseId: number; page?: number };
  now?: number;
}

/**
 * Reads the same local keys each feature already writes and packs them into one blob.
 * The daily-word section is date + guesses only — the answer is never copied.
 */
export function buildProgress(bookSlugs: string[], opts: BuildOptions = {}): ProgressBlob {
  const now = opts.now ?? Date.now();
  const blob: ProgressBlob = { v: 1, exp: now + CONTINUE_TTL_MS };

  // library — the open book, or the most recently read one among the given slugs
  if (opts.current) {
    blob.library = {
      bookId: opts.current.bookId,
      verseId: opts.current.verseId,
      ...(opts.current.page != null ? { page: opts.current.page } : {}),
    };
  } else {
    let best: { slug: string; at: number; block: number; page?: number } | null = null;
    for (const slug of bookSlugs) {
      const progress = readProgress(slug);
      if (!progress) continue;
      if (!best || progress.updatedAt > best.at) {
        best = { slug, at: progress.updatedAt, block: progress.block, page: progress.page };
      }
    }
    if (best) {
      blob.library = { bookId: best.slug, verseId: best.block, ...(best.page != null ? { page: best.page } : {}) };
    }
  }

  // padabandha — the resume map exactly as the game stores it
  const grid = parseStoredValues(readStorage<unknown>(`padabandha:${BEGINNER_PADABANDHA.id}:v1`, {}));
  if (Object.keys(grid).length > 0) {
    blob.padabandha = { packId: BEGINNER_PADABANDHA.id, grid };
  }

  // daily word — date + guesses only, never the target
  const today = dateKey(new Date(now));
  const daily = readStorage<{ date?: string; guesses?: unknown } | null>(`wordgame:${today}`, null);
  if (daily && daily.date === today && Array.isArray(daily.guesses) && daily.guesses.length > 0) {
    blob.dailyWord = { date: today, guesses: daily.guesses.filter((g): g is string => typeof g === "string") };
  }

  // stars — the implicit Favourites collection: words + proverbs
  const favourites = loadCollectionsData().collections.find((c) => c.id === FAVOURITES_COLLECTION_ID);
  if (favourites) {
    const words: string[] = [];
    const gade: string[] = [];
    for (const item of favourites.items) {
      if (item.kind === "word") words.push(item.word);
      else if (item.kind === "proverb") gade.push(item.proverbId);
    }
    if (words.length || gade.length) {
      blob.stars = { words: words.slice(-STAR_CAP), gade: gade.slice(-STAR_CAP) };
    }
  }

  return blob;
}

/** True when the blob has nothing worth carrying — the button explains this instead of a dead link. */
export function isEmptyBlob(blob: ProgressBlob): boolean {
  return !blob.library && !blob.padabandha && !blob.dailyWord && !blob.stars;
}
