/**
 * Pure helpers for the reader's bottom bar: chapter tick positions on the progress track and
 * the source host shown beside the licence label.
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

/** "https://kn.wikisource.org/wiki/…" → "kn.wikisource.org"; unparsable sources return "". */
export function sourceHost(source: string): string {
  try {
    return new URL(source).host;
  } catch {
    return "";
  }
}
