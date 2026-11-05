import type { Proverb } from "../types";

const variantKey = (text: string) => text.normalize("NFC").replace(/\p{P}/gu, "").replace(/\s+/gu, " ").trim();

/** Group punctuation/spacing-only variants; preserve source text and IDs without merging different words. */
export function proverbVariants(proverbs: readonly Proverb[]) {
  const groups = new Map<string, Proverb[]>();
  for (const proverb of proverbs) {
    const key = variantKey(proverb.text);
    groups.set(key, [...(groups.get(key) ?? []), proverb]);
  }
  const primary = [...groups.values()].map((group) => group[0]!);
  const variants = new Map(primary.map((proverb) => [proverb.id, groups.get(variantKey(proverb.text))!.slice(1)]));
  return { primary, variants };
}
