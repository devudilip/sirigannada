import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";
import type { Locale } from "@/lib/types";

/** Whole-number percent of a book read, clamped to 0…100. Zero when the book has no blocks. */
export function readPercent(block: number, blockCount: number): number {
  if (!Number.isFinite(block) || !Number.isFinite(blockCount) || blockCount <= 0) return 0;
  const pct = Math.round((block / blockCount) * 100);
  return Math.min(100, Math.max(0, pct));
}

/** Digits in the script of the UI locale: 26 → "೨೬" for Kannada, "26" for English. */
export function localiseDigits(n: number, locale: Locale): string {
  const text = String(n);
  return locale === "kn" ? arabicToKannadaDigits(text) : text;
}
