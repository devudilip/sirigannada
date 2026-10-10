import type { StringKey } from "@/lib/i18n";
import type { EvidenceTier, HistoryFact } from "../types";

/** Evidence tiers from strongest to weakest; the reader always shows them in this order. */
export const TIER_ORDER: readonly EvidenceTier[] = ["inscription", "scholarship", "legend"];

export const TIER_KEYS: Record<EvidenceTier, StringKey> = {
  inscription: "historyTierInscription",
  scholarship: "historyTierScholarship",
  legend: "historyTierLegend",
};

/** Facts by tier, in TIER_ORDER; tiers with no fact are left out. */
export function groupByTier(facts: readonly HistoryFact[]): Array<{ tier: EvidenceTier; facts: HistoryFact[] }> {
  return TIER_ORDER
    .map((tier) => ({ tier, facts: facts.filter((f) => f.tier === tier) }))
    .filter((group) => group.facts.length > 0);
}

/** The facts behind a list of ids, in the order the ids are given; unknown ids are skipped. */
export function pickFacts(facts: readonly HistoryFact[], ids: readonly string[]): HistoryFact[] {
  const byId = new Map(facts.map((f) => [f.id, f]));
  return ids.flatMap((id) => { const f = byId.get(id); return f ? [f] : []; });
}
