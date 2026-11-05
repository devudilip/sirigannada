import type { Proverb } from "../types";

/** Group punctuation/spacing-only variants; preserve source text and IDs without merging different words. */
export function proverbVariants(proverbs: readonly Proverb[]) {
  const groups = new Map<string, Proverb[]>();
  for (const proverb of proverbs) {
    const key = proverb.text.normalize("NFC").replace(/[\p{P}\p{Z}\s]/gu, "");
    groups.set(key, [...(groups.get(key) ?? []), proverb]);
  }
  const primary = [...groups.values()].map((group) => group[0]!);
  const variants = new Map(primary.map((proverb) => [proverb.id, groups.get(proverb.text.normalize("NFC").replace(/[\p{P}\p{Z}\s]/gu, ""))!.slice(1)]));
  return { primary, variants };
}
