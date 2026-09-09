import { describe, expect, it } from "vitest";
import { firstAkshara, percentOf, remaining, secondsAt, trackBackground } from "./scrubber";

describe("percentOf / secondsAt", () => {
  it("round-trip within the duration", () => {
    expect(percentOf(30, 120)).toBe(25);
    expect(secondsAt(25, 120)).toBe(30);
  });
  it("clamps and tolerates an unknown duration", () => {
    expect(percentOf(500, 120)).toBe(100);
    expect(percentOf(-5, 120)).toBe(0);
    expect(percentOf(10, 0)).toBe(0);
    expect(secondsAt(150, 120)).toBe(120);
    expect(secondsAt(50, NaN)).toBe(0);
  });
});

describe("remaining", () => {
  it("is non-positive so formatClock shows a leading minus", () => {
    expect(remaining(76, 328)).toBe(-252);
    expect(remaining(400, 328)).toBe(-0);
  });
});

describe("trackBackground", () => {
  it("uses only design tokens at the given percent", () => {
    const bg = trackBackground(33.333);
    expect(bg).toContain("var(--sg-gold) 33.33%");
    expect(bg).toContain("var(--sg-paper-edge) 33.33%");
    expect(bg).not.toMatch(/#[0-9a-f]{3,6}/i);
  });
  it("clamps out-of-range percents", () => {
    expect(trackBackground(140)).toContain("100.00%");
    expect(trackBackground(-3)).toContain("0.00%");
  });
});

describe("firstAkshara", () => {
  it("returns the first orthographic syllable, keeping vowel signs and conjuncts", () => {
    expect(firstAkshara("ಪುಣ್ಯಕೋಟಿ")).toBe("ಪು");
    expect(firstAkshara("ಕನ್ನಡ ಕಥೆ")).toBe("ಕ");
    expect(firstAkshara("  ಹಸು")).toBe("ಹ");
  });
  it("handles Latin and empty titles", () => {
    expect(firstAkshara("Story")).toBe("S");
    expect(firstAkshara("")).toBe("");
  });
});
