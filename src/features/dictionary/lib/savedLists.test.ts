import { describe, expect, it } from "vitest";
import {
  isRecordableQuery,
  lookupToRemember,
  parseHistory,
  parseStringList,
  pushHistory,
  toggleFavourite,
} from "./savedLists";

const hit = (word: string) => ({ entry: { word } });

describe("parseStringList", () => {
  it("accepts only non-empty strings", () => {
    expect(parseStringList(["ಮನೆ", "", 3, "ಶಾಲೆ"])).toEqual(["ಮನೆ", "ಶಾಲೆ"]);
    expect(parseStringList(null)).toEqual([]);
  });
});

describe("parseHistory", () => {
  it("trims a list saved under the old 20-item cap to the newest 8", () => {
    const stored = Array.from({ length: 20 }, (_, i) => `w${i}`);
    expect(parseHistory(stored)).toEqual(stored.slice(0, 8));
  });
});

describe("isRecordableQuery", () => {
  it("rejects blanks and a single akshara or Latin letter", () => {
    for (const q of ["", "  ", "ಕ", "ಮೆ", "ಕ್ಷ", "ಸ್ತ್ರೀ", "a"]) expect(isRecordableQuery(q)).toBe(false);
  });

  it("accepts words of two or more aksharas and Latin words", () => {
    for (const q of ["ಮನೆ", "ಔಷಧ", "ಕನ್ನಡ", "go"]) expect(isRecordableQuery(q)).toBe(true);
  });
});

describe("lookupToRemember", () => {
  it("keeps a Kannada query only when it is itself a headword", () => {
    expect(lookupToRemember("ಮನೆ", [hit("ಮನೆ"), hit("ಮನೆತನ")])).toBe("ಮನೆ");
    expect(lookupToRemember("ಮನ", [hit("ಮನೆ"), hit("ಮನೆತನ")])).toBeNull();
  });

  it("keeps a Latin query that found something", () => {
    expect(lookupToRemember(" house ", [hit("ಮನೆ")])).toBe("house");
    expect(lookupToRemember("zzqx", [])).toBeNull();
  });

  it("never keeps a single akshara, even when it is a headword", () => {
    expect(lookupToRemember("ಕ", [hit("ಕ")])).toBeNull();
  });
});

describe("pushHistory", () => {
  it("puts the newest query first and drops older duplicates", () => {
    expect(pushHistory(["ಶಾಲೆ", "ನೀರು"], "ಮನೆ")).toEqual(["ಮನೆ", "ಶಾಲೆ", "ನೀರು"]);
    expect(pushHistory(["ಮನೆ", "ಶಾಲೆ"], "ಮನೆ")).toEqual(["ಮನೆ", "ಶಾಲೆ"]);
  });

  it("keeps the last 8 searches", () => {
    const items = Array.from({ length: 8 }, (_, i) => `w${i}`);
    const next = pushHistory(items, "new");
    expect(next).toHaveLength(8);
    expect(next[0]).toBe("new");
    expect(next.at(-1)).toBe("w6");
  });

  it("ignores blank and single-akshara queries", () => {
    expect(pushHistory(["ಮನೆ"], "  ")).toEqual(["ಮನೆ"]);
    expect(pushHistory(["ಮನೆ"], "ಕ")).toEqual(["ಮನೆ"]);
  });
});

describe("toggleFavourite", () => {
  it("stars to the front and unstars", () => {
    expect(toggleFavourite(["ಶಾಲೆ"], "ಮನೆ")).toEqual(["ಮನೆ", "ಶಾಲೆ"]);
    expect(toggleFavourite(["ಮನೆ", "ಶಾಲೆ"], "ಮನೆ")).toEqual(["ಶಾಲೆ"]);
  });
});
