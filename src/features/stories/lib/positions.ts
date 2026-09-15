import { readStorage, writeStorage } from "@/lib/storage";

/** Positions closer than this to the end count as finished: resume restarts from 0. */
const FINISHED_MARGIN_SEC = 3;
/** Don't bother remembering the first few seconds. */
const MIN_SAVE_SEC = 2;

export interface StoryPosition {
  positionSec: number;
  durationSec: number;
  updatedAt: number;
}

const key = (slug: string): string => `story:pos:${slug}`;

export function readPosition(slug: string): StoryPosition | null {
  return readStorage<StoryPosition | null>(key(slug), null);
}

export function writePosition(slug: string, positionSec: number, durationSec: number, now = Date.now()): void {
  if (positionSec < MIN_SAVE_SEC) return;
  writeStorage<StoryPosition>(key(slug), { positionSec, durationSec, updatedAt: now });
}

export function clearPosition(slug: string): void {
  writeStorage<StoryPosition | null>(key(slug), null);
}

/** Where to start `slug`: the saved position, or 0 when nothing saved or the story was finished. */
export function resumeAt(saved: StoryPosition | null): number {
  if (!saved) return 0;
  if (saved.durationSec > 0 && saved.positionSec >= saved.durationSec - FINISHED_MARGIN_SEC) return 0;
  return saved.positionSec;
}

/** The most recently touched, unfinished story among `slugs` — feeds the hub's Continue block. */
export function pickContinue(slugs: readonly string[], read: (slug: string) => StoryPosition | null = readPosition): { slug: string; position: StoryPosition } | null {
  let best: { slug: string; position: StoryPosition } | null = null;
  for (const slug of slugs) {
    const position = read(slug);
    if (!position || resumeAt(position) === 0) continue;
    if (!best || position.updatedAt > best.position.updatedAt) best = { slug, position };
  }
  return best;
}
