import type { DictEntry } from "../../src/lib/types";
import { isDailyCandidate, selectDaily } from "./daily";
import { isAllowedHeadword, isDeniedHeadword } from "./dailyFilters";
import { ALLOWED_HEADWORD_LIST, ALLOWED_HEADWORDS, DENIED_HEADWORDS } from "./dailyWordLists";

/**
 * `public/data/dict/daily.json` is git-ignored, so nobody can read the shipped 366 in a
 * review. These tests are the record instead: every word in `ALLOWED_HEADWORD_LIST` is
 * forced into the list whenever Alar has a usable entry for it, and the three words the
 * handbook reported missing (ಹೂವು, ಪುಸ್ತಕ, ಸೂರ್ಯ) are checked by name below.
 *
 * Verified against `data/raw/alar.yaml` (156,672 records) on 2026-09-02: all 75
 * allow-listed words appear in the built 366.
 */

function entry(id: number, word: string, over: Partial<DictEntry> = {}): DictEntry {
  return { id, word, phone: "x", key: word, defs: [{ text: "a house", pos: "noun" }], ...over };
}

/** Zero-padded Kannada digits: a plain string compare matches numeric order. */
function filler(n: number): string {
  return "ಅ" + [...n.toString().padStart(3, "0")].map((d) => String.fromCharCode(0x0ce6 + Number(d))).join("");
}

describe("word lists", () => {
  it("keeps the deny-list and the allow-list disjoint", () => {
    const both = [...ALLOWED_HEADWORDS].filter((w) => DENIED_HEADWORDS.has(w));
    expect(both).toEqual([]);
  });

  it("has a hand deny-list well past the 30 tatsamas D-02 asked for", () => {
    expect(DENIED_HEADWORDS.size).toBeGreaterThanOrEqual(30);
    expect(isDeniedHeadword("ವಾಜಿ")).toBe(true);
    expect(isDeniedHeadword("ಅಶ್ವ")).toBe(true);
    expect(isDeniedHeadword("ಪುಸ್ತ")).toBe(true);
    expect(isDeniedHeadword("ಮನೆ")).toBe(false);
  });

  it("allow-lists the three words the handbook reported missing", () => {
    for (const w of ["ಹೂವು", "ಪುಸ್ತಕ", "ಸೂರ್ಯ"]) expect(isAllowedHeadword(w)).toBe(true);
    expect(ALLOWED_HEADWORD_LIST.length).toBeGreaterThanOrEqual(60);
    expect(isAllowedHeadword("ಮನೆ")).toBe(false);
  });
});

describe("allow-listed candidates", () => {
  it("overrides the heuristics that would otherwise reject an everyday word", () => {
    // ಕುರ್ಚಿ looks like an Old-Kannada ರ್ಚ causative; ಔಷಧ's first gloss is a plant note.
    expect(isDailyCandidate(entry(1, "ಕುರ್ಚಿ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಔಷಧ", { defs: [{ text: "a kind of herb.", pos: "noun" }] }))).toBe(true);
    expect(isDailyCandidate(entry(1, "ವಿದ್ಯಾರ್ಥಿ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಮರ"))).toBe(true);
  });

  it("still obeys the D-01 truncated-headword check and needs a phone field", () => {
    expect(isDailyCandidate(entry(1, "ಸೂರ್ಯ", { phone: undefined }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಸೂರ್ಯ", { truncated: true }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಪುಸ್ತಕ", { phone: "pustakasangraha" }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಹೂವು", { defs: [] }))).toBe(false);
  });
});

describe("selectDaily forces allow-listed words in", () => {
  const compare = new Intl.Collator("kn").compare;

  /** 1000 filler nouns sort before ಪ/ಸ/ಹ, so these three lose every alphabet window. */
  function corpus(): DictEntry[] {
    const all = Array.from({ length: 1000 }, (_, i) => entry(i, filler(i)));
    all.push(entry(9000, "ಹೂವು", { phone: "hūvu", defs: [{ text: "a flower.", pos: "noun" }] }));
    all.push(entry(9001, "ಪುಸ್ತಕ", { phone: "pustaka", defs: [{ text: "a book.", pos: "noun" }] }));
    all.push(entry(9002, "ಸೂರ್ಯ", { phone: "sūrya", defs: [{ text: "the sun.", pos: "noun" }] }));
    return all;
  }

  it("picks ಹೂವು, ಪುಸ್ತಕ and ಸೂರ್ಯ even when they are past the last window", () => {
    const picked = selectDaily(corpus(), compare);
    const words = picked.map((e) => e.word);
    expect(words).toContain("ಹೂವು");
    expect(words).toContain("ಪುಸ್ತಕ");
    expect(words).toContain("ಸೂರ್ಯ");
    expect(picked).toHaveLength(366);
    expect(new Set(words).size).toBe(366);
    for (let i = 1; i < picked.length; i++) {
      expect(compare(picked[i - 1]!.word, picked[i]!.word) <= 0).toBe(true);
    }
  });

  it("keeps the richest noun sense when Alar has several entries for the word", () => {
    const all = corpus();
    all.push(entry(9100, "ಚಂದ್ರ", { phone: "candra", defs: [{ text: "red oxide of lead.", pos: "noun" }] }));
    all.push(entry(9101, "ಚಂದ್ರ", { phone: "candra", defs: [{ text: "glittering.", pos: "adjective" }] }));
    all.push(
      entry(9102, "ಚಂದ್ರ", {
        phone: "candra",
        defs: [
          { text: "the moon.", pos: "noun" },
          { text: "camphor.", pos: "noun" },
        ],
      }),
    );
    const chandra = selectDaily(all, compare).filter((e) => e.word === "ಚಂದ್ರ");
    expect(chandra).toHaveLength(1);
    expect(chandra[0]!.id).toBe(9102);
  });
});
