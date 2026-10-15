import { describe, expect, it } from "vitest";
import type { HistoryFact } from "../types";
import { groupByTier, pickFacts } from "./tiers";

const fact = (id: string, tier: HistoryFact["tier"]): HistoryFact => ({ id, tier, source: "s", text: { kn: "ಕ", en: "k" } });

describe("evidence tiers", () => {
  it("groups facts strongest first and drops empty tiers", () => {
    const groups = groupByTier([fact("a", "legend"), fact("b", "inscription"), fact("c", "inscription")]);
    expect(groups.map((g) => g.tier)).toEqual(["inscription", "legend"]);
    expect(groups[0]?.facts.map((f) => f.id)).toEqual(["b", "c"]);
  });
  it("resolves ids in the given order and skips unknown ones", () => {
    expect(pickFacts([fact("a", "legend"), fact("b", "scholarship")], ["b", "x", "a"]).map((f) => f.id)).toEqual(["b", "a"]);
  });
});
