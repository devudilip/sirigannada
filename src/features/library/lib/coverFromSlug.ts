/**
 * Deterministic cover variant from a book slug. Colours stay in the
 * accent / paper / ink token set; pattern geometry is picked from the hash.
 */

export const COVER_PATTERNS = [
  "bands",
  "stripes",
  "hatch",
  "dots",
  "diamonds",
  "chevrons",
  "arcs",
  "grid",
] as const;

export type CoverPatternId = (typeof COVER_PATTERNS)[number];

export const COVER_SCHEMES = ["paper", "accent", "ink"] as const;
export type CoverScheme = (typeof COVER_SCHEMES)[number];

export interface CoverSpec {
  pattern: CoverPatternId;
  scheme: CoverScheme;
  /** Flip the pattern between the two remaining token colours. */
  altTone: boolean;
  dense: boolean;
}

function pick<T>(items: readonly T[], n: number): T {
  const item = items[n % items.length];
  if (item === undefined) throw new Error("coverFromSlug: empty list");
  return item;
}

/** FNV-1a 32-bit. Stable across sessions; only used to pick a cover variant. */
export function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function coverFromSlug(slug: string): CoverSpec {
  const h = hashSlug(slug);
  return {
    pattern: pick(COVER_PATTERNS, h),
    scheme: pick(COVER_SCHEMES, h >>> 8),
    altTone: Boolean((h >>> 16) & 1),
    dense: Boolean((h >>> 17) & 1),
  };
}

export function coverKey(spec: CoverSpec): string {
  const tone = spec.altTone ? "alt" : "main";
  const weight = spec.dense ? "dense" : "open";
  return `${spec.pattern}-${spec.scheme}-${tone}-${weight}`;
}

/** First Kannada (or Latin) grapheme — the cover watermark. */
export function firstAkshara(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const parts = new Intl.Segmenter("kn", { granularity: "grapheme" }).segment(trimmed);
  for (const part of parts) return part.segment;
  return "";
}
