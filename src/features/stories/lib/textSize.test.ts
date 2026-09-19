import { describe, expect, it } from "vitest";
import { DEFAULT_TEXT_SIZE, isTextSize, nextTextSize, readTextSize, TEXT_SIZES } from "./textSize";

describe("nextTextSize", () => {
  it("cycles 18 → 22 → 26 → 18", () => {
    expect(nextTextSize(18)).toBe(22);
    expect(nextTextSize(22)).toBe(26);
    expect(nextTextSize(26)).toBe(18);
  });

  it("restarts at the default for an unknown size", () => {
    expect(nextTextSize(15)).toBe(DEFAULT_TEXT_SIZE);
  });
});

describe("isTextSize", () => {
  it("accepts only the listed sizes", () => {
    for (const s of TEXT_SIZES) expect(isTextSize(s)).toBe(true);
    expect(isTextSize(20)).toBe(false);
    expect(isTextSize("22")).toBe(false);
  });
});

describe("readTextSize", () => {
  it("falls back to the default outside a browser", () => {
    expect(readTextSize()).toBe(DEFAULT_TEXT_SIZE);
  });
});
