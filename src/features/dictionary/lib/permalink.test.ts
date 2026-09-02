import { describe, expect, it } from "vitest";
import { entryPermalinkPath, entryPermalinkUrl, headwordFromParams } from "./permalink";

describe("entryPermalinkPath", () => {
  it("encodes the NFC-normalised headword", () => {
    expect(entryPermalinkPath("ಮನೆ")).toBe(`/dictionary?w=${encodeURIComponent("ಮನೆ")}`);
    expect(entryPermalinkPath("  ಶಾಲೆ  ")).toBe(`/dictionary?w=${encodeURIComponent("ಶಾಲೆ")}`);
  });
});

describe("entryPermalinkUrl", () => {
  it("joins origin without a double slash", () => {
    expect(entryPermalinkUrl("ಮನೆ", "https://www.sirigannada.in")).toBe(
      `https://www.sirigannada.in/dictionary?w=${encodeURIComponent("ಮನೆ")}`,
    );
    expect(entryPermalinkUrl("ಮನೆ", "https://www.sirigannada.in/")).toBe(
      `https://www.sirigannada.in/dictionary?w=${encodeURIComponent("ಮನೆ")}`,
    );
  });

  it("returns the path when origin is empty", () => {
    expect(entryPermalinkUrl("ಮನೆ")).toBe(entryPermalinkPath("ಮನೆ"));
  });
});

describe("headwordFromParams", () => {
  it("prefers w over q", () => {
    const get = (key: string) => (key === "w" ? "ಮನೆ" : key === "q" ? "ಶಾಲೆ" : null);
    expect(headwordFromParams(get)).toBe("ಮನೆ");
  });

  it("falls back to q when w is absent", () => {
    expect(headwordFromParams((key) => (key === "q" ? "ನೀರು" : null))).toBe("ನೀರು");
  });

  it("returns empty when both are missing", () => {
    expect(headwordFromParams(() => null)).toBe("");
  });
});
