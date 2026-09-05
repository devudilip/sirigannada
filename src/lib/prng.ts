/**
 * Tiny deterministic PRNG (mulberry32). Used wherever the app needs a repeatable shuffle without
 * a dependency: build-time puzzle generation and per-device round ordering. Not for security.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle of `0..total-1`, fully determined by `seed`. */
export function shuffledIndices(total: number, seed: number): number[] {
  const out = Array.from({ length: Math.max(0, total) }, (_, i) => i);
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
