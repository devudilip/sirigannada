/**
 * Deterministic pseudo-random helpers for quiz-deck building (L-08). "Deterministic" here means
 * reproducible/testable — the same seed always yields the same deck — not day-of-year-locked
 * content. Callers seed with something session-scoped (e.g. Date.now() at deck-build time), so
 * decks differ practice to practice while remaining a pure function of (data, seed) for tests.
 */

/** mulberry32: tiny, fast, good-enough PRNG for shuffling — not for anything security-sensitive. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using a seeded RNG. Never mutates `items`. */
export function seededShuffle<T>(items: readonly T[], rng: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Picks `count` items at random positions from `items`, excluding index `excludeIndex`. */
export function pickRandom<T>(items: readonly T[], count: number, rng: () => number, excludeIndex?: number): T[] {
  const pool = items.map((item, i) => ({ item, i })).filter(({ i }) => i !== excludeIndex);
  return seededShuffle(pool, rng)
    .slice(0, count)
    .map(({ item }) => item);
}
