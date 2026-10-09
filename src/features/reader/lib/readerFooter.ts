/**
 * Pure helpers for the reader's bottom bar (chapter dots on the progress track) and its book
 * credit (the source host shown beside the licence label under the chapter list).
 */

/**
 * Fractions (0..1) along the progress track where chapters begin, one per distinct view.
 * The first view is skipped — the track's left edge already marks the start — and anything
 * beyond the last view is clamped so a mismeasured layout never draws off the track.
 */
export function tickFractions(chapterViews: readonly number[], viewCount: number): number[] {
  if (viewCount <= 1) return [];
  const seen = new Set<number>();
  const out: number[] = [];
  for (const view of chapterViews) {
    const clamped = Math.min(Math.max(0, view), viewCount - 1);
    if (clamped === 0 || seen.has(clamped)) continue;
    seen.add(clamped);
    out.push(clamped / (viewCount - 1));
  }
  return out;
}

/**
 * Thins chapter markers so neighbours sit at least `minGap` (a fraction of the track) apart, and
 * away from the track's start: a book with a hundred short chapters gets an even scatter of dots,
 * not a solid smear. Keeps the earliest marker of each crowded run.
 */
export function spaceTicks(fractions: readonly number[], minGap: number): number[] {
  const out: number[] = [];
  let last = 0;
  for (const f of [...fractions].sort((a, b) => a - b)) {
    if (f - last < minGap) continue;
    out.push(f);
    last = f;
  }
  return out;
}

/** "https://kn.wikisource.org/wiki/…" → "kn.wikisource.org"; unparsable sources return "". */
export function sourceHost(source: string): string {
  try {
    return new URL(source).host;
  } catch {
    return "";
  }
}
