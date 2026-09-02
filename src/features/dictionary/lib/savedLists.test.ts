import { describe, expect, it } from "vitest";
import { parseStringList, pushHistory, toggleFavourite } from "./savedLists";

describe("parseStringList", () => {
  it("accepts only non-empty strings", () => {
    expect(parseStringList(["ಮನೆ", "", 3, "ಶಾಲೆ"])).toEqual(["ಮನೆ", "ಶಾಲೆ"]);
    expect(parseStringList(null)).toEqual([]);
  });
});

describe("pushHistory", () => {
  it("puts the newest query first and drops older duplicates", () => {
    expect(pushHistory(["ಶಾಲೆ", "ನೀರು"], "ಮನೆ")).toEqual(["ಮನೆ", "ಶಾಲೆ", "ನೀರು"]);
    expect(pushHistory(["ಮನೆ", "ಶಾಲೆ"], "ಮನೆ")).toEqual(["ಮನೆ", "ಶಾಲೆ"]);
  });

  it("keeps the last 20 searches", () => {
    const items = Array.from({ length: 20 }, (_, i) => `w${i}`);
    const next = pushHistory(items, "new");
    expect(next).toHaveLength(20);
    expect(next[0]).toBe("new");
    expect(next.at(-1)).toBe("w18");
  });

  it("ignores blank queries", () => {
    expect(pushHistory(["ಮನೆ"], "  ")).toEqual(["ಮನೆ"]);
  });
});

describe("toggleFavourite", () => {
  it("stars to the front and unstars", () => {
    expect(toggleFavourite(["ಶಾಲೆ"], "ಮನೆ")).toEqual(["ಮನೆ", "ಶಾಲೆ"]);
    expect(toggleFavourite(["ಮನೆ", "ಶಾಲೆ"], "ಮನೆ")).toEqual(["ಶಾಲೆ"]);
  });
});
