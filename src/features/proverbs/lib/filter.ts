import { hasKannada, latinToKannada, normalise } from "@/lib/kannada";
import type { Proverb } from "../types";

/** Substring match; Latin queries are also tried as Kannada via the shared transliterator. */
export function filterProverbs(items: readonly Proverb[], query: string): Proverb[] {
  const q = normalise(query);
  if (!q) return [...items];
  const needles: string[] = [q];
  if (!hasKannada(q)) {
    const kn = latinToKannada(q);
    if (kn) needles.push(kn);
  }
  return items.filter((p) => needles.some((n) => p.text.includes(n)));
}
