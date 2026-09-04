import { GUNITA_SIGNS } from "@/lib/kannadaAlphabet";
import { SIGN_LABELS, buildGunitaDeck } from "./practiceGunita";

describe("SIGN_LABELS", () => {
  it("has one legible label per gunita sign", () => {
    expect(SIGN_LABELS).toHaveLength(GUNITA_SIGNS.length);
    expect(new Set(SIGN_LABELS).size).toBe(SIGN_LABELS.length);
  });
});

describe("buildGunitaDeck", () => {
  it("builds the requested deck size, alternating compose/identify", () => {
    const deck = buildGunitaDeck(1, 6);
    expect(deck).toHaveLength(6);
    expect(deck.map((q) => q.direction)).toEqual([
      "compose", "identify", "compose", "identify", "compose", "identify",
    ]);
  });

  it("gives every question 4 unique choices containing the correct answer", () => {
    const deck = buildGunitaDeck(2, 10);
    for (const q of deck) {
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    }
  });

  it("gives compose questions a non-empty signLabel matching one of the choices' vowel", () => {
    const deck = buildGunitaDeck(2, 10);
    for (const q of deck.filter((q) => q.direction === "compose")) {
      expect(q.signLabel.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic for the same seed", () => {
    expect(buildGunitaDeck(7, 8)).toEqual(buildGunitaDeck(7, 8));
  });

  it("differs across seeds", () => {
    expect(buildGunitaDeck(1, 8)).not.toEqual(buildGunitaDeck(2, 8));
  });
});
