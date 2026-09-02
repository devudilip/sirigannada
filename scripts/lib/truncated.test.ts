import { isDailyCandidate } from "./daily";
import { isTruncatedHeadword, phoneVowelCount } from "./truncated";
import type { DictEntry } from "../../src/lib/types";

function entry(word: string, phone: string): DictEntry {
  return { id: 1, word, phone, key: word, defs: [{ text: "a house", pos: "noun" }] };
}

describe("phoneVowelCount", () => {
  it("counts IAST vowels, treating ai/au as one", () => {
    expect(phoneVowelCount("abhyukṣaṇa")).toBe(4);
    expect(phoneVowelCount("mane")).toBe(2);
    expect(phoneVowelCount("kai")).toBe(1);
  });
});

describe("isTruncatedHeadword", () => {
  it("flags three real Alar stubs whose phone is the full word", () => {
    expect(isTruncatedHeadword("ಅಭ್ಯು", "abhyukṣaṇa")).toBe(true);
    expect(isTruncatedHeadword("ಏಳುಹ", "ēḷuhannondāgu")).toBe(true);
    expect(isTruncatedHeadword("ಅಪರಿಣಾಮ", "apariṇāmavihāra")).toBe(true);
  });

  it("keeps complete headwords when phone vowels match aksharas", () => {
    expect(isTruncatedHeadword("ಮನೆ", "mane")).toBe(false);
    expect(isTruncatedHeadword("ಅಭ್ಯುಕ್ಷಣ", "abhyukṣaṇa")).toBe(false);
    expect(isTruncatedHeadword("ಅನುಕ", "anuka")).toBe(false);
  });
});

describe("daily list excludes truncated headwords", () => {
  it("rejects ಅಭ್ಯು / abhyukṣaṇa as a daily-word candidate", () => {
    expect(isDailyCandidate(entry("ಅಭ್ಯು", "abhyukṣaṇa"))).toBe(false);
    expect(isDailyCandidate(entry("ಮನೆ", "mane"))).toBe(true);
  });
});
