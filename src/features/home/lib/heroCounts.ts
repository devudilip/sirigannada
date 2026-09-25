import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";
import type { Locale } from "@/lib/types";

/** Indian digit grouping (2,194 · 1,23,456), with Kannada digits in the Kannada UI. */
export function formatCount(n: number, locale: Locale): string {
  const grouped = n.toLocaleString("en-IN");
  return locale === "kn" ? arabicToKannadaDigits(grouped) : grouped;
}
