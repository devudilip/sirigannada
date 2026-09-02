import type { DictEntry } from "../../src/lib/types";
import { DAILY_COUNT, familySizes, isDailyCandidate, pickStratified, selectDaily, stratumQuotas } from "./daily";
import { buildReverseIndex, toReverseShard } from "./reverse";

function entry(id: number, word: string, over: Partial<DictEntry> = {}): DictEntry {
  return { id, word, phone: "x", key: word, defs: [{ text: "a house", pos: "noun" }], ...over };
}

/** Zero-padded Kannada digits so a simple string compare matches numeric order. */
function knWord(n: number): string {
  return (
    "ಅ" +
    [...n.toString().padStart(3, "0")].map((d) => String.fromCharCode(0x0ce6 + Number(d))).join("")
  );
}

describe("isDailyCandidate", () => {
  it("accepts short nouns with a phone field", () => {
    expect(isDailyCandidate(entry(1, "ಮನೆ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಅಂಗೀಕಾರ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಅಖಿಲ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಈಟಿ"))).toBe(true);
  });

  it("rejects by length, phone, pos, defs count, markers and bad characters", () => {
    expect(isDailyCandidate(entry(1, "ಅ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅಂ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅಂಕಪರದೆಯಿಂದ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { phone: undefined }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "hey", pos: "interjection" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: Array(25).fill({ text: "x", pos: "noun" }) }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "(obsolete) hut", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "Archaic word", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "= ಗೃಹ.", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ ಕೆಲಸ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ-ಕೆಲಸ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ2"))).toBe(false);
  });

  it("rejects Old-Kannada letters and ZWJ / ZWNJ in the headword", () => {
    expect(isDailyCandidate(entry(1, "ಅಱಿ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅೞಿವಗೆ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನ\u200Dೆ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನ\u200Cೆ"))).toBe(false);
  });

  it("rejects virama-ra-virama, doubled virama, and bare-consonant endings", () => {
    expect(isDailyCandidate(entry(1, "ಅಥ್ರ್ಯ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅನಾದ್ರ್ರ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅ್್ಕ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಆರ್"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಇಜ್ಜತ್"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಬೇಸನ್"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಪಿಂ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಯಶಃಪಿಂಡ"))).toBe(false);
  });

  it("rejects scholarly, technical, and catalogue definitions", () => {
    expect(
      isDailyCandidate(
        entry(1, "ಕಸಲೆ", {
          defs: [{ text: "the annual plant Amaranthus tenuifolius of Amaranthaceae family.", pos: "noun" }],
        }),
      ),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಪಜ್ಝಟಿಕೆ", { defs: [{ text: "(in prosody) a metre of four lines.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ತುಜಾವಂತು", { defs: [{ text: "(in music) a musical mode.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಗುಳಿಕ", { defs: [{ text: "(in astrology) a minor planet.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅಸ್ಥಾನಪದ", { defs: [{ text: "(in grammar) a fault of diction.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ನ್ಯಾಯ", { defs: [{ text: "(in logic) a fallacious argument.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಪೃಷ್ಠಕ", { defs: [{ text: "(in Jainism) a mythological aircraft.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಮಂತ್ರ", { defs: [{ text: "(in Vedic) a sacred hymn.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(
        entry(1, "ದಾಸಭಾವ", { defs: [{ text: "(in Vaiṣṇavism) absolute surrender to Viṣṇu.", pos: "noun" }] }),
      ),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅನುಶೈವ", { defs: [{ text: "(in Śaivism) an initiated member.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(
        entry(1, "ಶಿವಯೋಗ", { defs: [{ text: "(in Vīraśaivism) yogic meditation on Śiva.", pos: "noun" }] }),
      ),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅರುಣಾವರಜ", { defs: [{ text: "(mythology) Garuḍa, brother of Aruṇa.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅಂಕ", { defs: [{ text: "(in arithmetic) a numerical figure.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅಂತರಲಗಡ", { defs: [{ text: "one of the locks used in wrestling.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅಸಲೆ", { defs: [{ text: "the ninth of the lunar mansions.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅಮೃತಗರ್ಭ", { defs: [{ text: "butter processed in a particular manner.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಗಂಡಗರಿಗೆ", { defs: [{ text: "a kind of tree.", pos: "noun" }] })),
    ).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಗುಳಿಕ", { defs: [{ text: "(myth.) one of the eight chief serpents.", pos: "noun" }] })),
    ).toBe(false);
    // ಅಜ್ಜ, not ಅಮ್ಮ: allow-listed words (D-02) skip the marker filters on purpose.
    expect(isDailyCandidate(entry(1, "ಅಜ್ಜ", { defs: [{ text: "(obs.) a male parent; a father.", pos: "noun" }] }))).toBe(
      false,
    );
    expect(isDailyCandidate(entry(1, "ಹೂಣ", { defs: [{ text: "(hist.) a province in south-east China.", pos: "noun" }] }))).toBe(
      false,
    );
    expect(isDailyCandidate(entry(1, "ಅನ್ವೇಷಕ", { defs: [{ text: "he who searches for.", pos: "noun" }] }))).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ರೇಕೆ", { defs: [{ text: "(correctly ರೇಖೆ) 1. a line joining two points.", pos: "noun" }] })),
    ).toBe(false);
    expect(isDailyCandidate(entry(1, "ಇದಿರಂನಡೆ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅಭವ", { defs: [{ text: "Śiva.", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಎತ್ವ", { defs: [{ text: "the vowel 'ಎ'.", pos: "noun" }] }))).toBe(false);
    expect(
      isDailyCandidate(entry(1, "ಅಮೇಧ್ಯ", { defs: [{ text: "unfit for being used in a sacrifice.", pos: "noun" }] })),
    ).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅಣುಗ", { defs: [{ text: "a beloved man.", pos: "noun" }] }))).toBe(false);
  });

  it("rejects obvious proper-noun glosses", () => {
    const no = (w: string, t: string): void => {
      expect(isDailyCandidate(entry(1, w, { defs: [{ text: t, pos: "noun" }] }))).toBe(false);
    };
    no("ಆನಂದಪುರ", "name of a town; the abode of Viṣṇu.");
    no("ಗಂಗೆ", "a river in North India.");
    no("ಕೈಲಾಸ", "a mountain; abode of Śiva.");
    no("ಹರಿ", "another name for Viṣṇu.");
    no("ರಾಜ", "a king of the solar dynasty.");
    no("ವಸಿಷ್ಠ", "a sage of ancient India.");
    no("ದೇವ", "a deity worshipped in temples.");
    no("ಊರು", "a village on the river bank.");
  });
});

describe("selectDaily", () => {
  const compare = new Intl.Collator("kn").compare;

  it("returns exactly 366 sorted, evenly spaced entries", () => {
    const all = Array.from({ length: 1000 }, (_, i) => entry(i, knWord(i)));
    const picked = selectDaily(all, compare);
    expect(picked).toHaveLength(DAILY_COUNT);
    expect(new Set(picked.map((e) => e.id)).size).toBe(DAILY_COUNT);
    for (let i = 1; i < picked.length; i++) {
      expect(compare(picked[i - 1]!.word, picked[i]!.word) <= 0).toBe(true);
    }
  });

  it("throws when there are too few candidates", () => {
    expect(() => selectDaily([entry(1, "ಮನೆ")], compare)).toThrow(/candidates/);
  });
});

describe("familySizes", () => {
  it("counts other headwords that start with the candidate", () => {
    const all = [
      entry(1, "ಮನೆ"),
      entry(2, "ಮನೆಗೆಲಸ"),
      entry(3, "ಮನೆತನ"),
      entry(4, "ಕೈ"),
      entry(5, "ಊರು"),
    ];
    const sizes = familySizes(all);
    expect(sizes.get(1)).toBe(2);
    expect(sizes.get(2)).toBe(0);
    expect(sizes.get(3)).toBe(0);
    expect(sizes.get(4)).toBe(0);
    expect(sizes.get(5)).toBe(0);
  });

  it("counts only consonant-continuations, not vowel-sign stems", () => {
    const all = [entry(1, "ಕಾಲ"), entry(2, "ಕಾಲು"), entry(3, "ಕಾಲಕಳೆ")];
    const sizes = familySizes(all);
    expect(sizes.get(1)).toBe(1);
    expect(sizes.get(2)).toBe(0);
  });
});

describe("pickStratified", () => {
  const byWord = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

  it("yields a 60/20/20 noun/adjective/verb mix", () => {
    expect(stratumQuotas(10)).toEqual({ noun: 6, adjective: 2, verb: 2 });
    const all: DictEntry[] = [];
    for (let i = 0; i < 18; i++) all.push(entry(i, knWord(i)));
    for (let i = 0; i < 6; i++) {
      all.push(entry(100 + i, knWord(100 + i), { defs: [{ text: "big", pos: "adjective" }] }));
    }
    for (let i = 0; i < 6; i++) {
      all.push(entry(200 + i, knWord(200 + i), { defs: [{ text: "to run", pos: "verb" }] }));
    }
    const picked = pickStratified(all, byWord, familySizes(all), 10);
    expect(picked).toHaveLength(10);
    const pos = picked.map((e) => e.defs[0]!.pos);
    expect(pos.filter((p) => p === "noun")).toHaveLength(6);
    expect(pos.filter((p) => p === "adjective")).toHaveLength(2);
    expect(pos.filter((p) => p === "verb")).toHaveLength(2);
    for (let i = 1; i < picked.length; i++) {
      expect(byWord(picked[i - 1]!.word, picked[i]!.word) <= 0).toBe(true);
    }
  });

  it("prefers the prefix with the larger family in a window", () => {
    const all = [entry(1, "ಮನೆ"), entry(2, "ಮನೆಗೆಲಸ"), entry(3, "ಮನೆತನ"), entry(4, "ಮನೆಗೆಡು")];
    const picked = pickStratified(all, byWord, familySizes(all), 1);
    expect(picked).toHaveLength(1);
    expect(picked[0]!.word).toBe("ಮನೆ");
  });
});

describe("buildReverseIndex", () => {
  it("maps tokens to [id, word] pairs, one per entry, most relevant first", () => {
    const idx = buildReverseIndex([
      entry(1, "ಅಂಕಣ", { defs: [{ text: "a pillar or column supporting the roof of a house", pos: "noun" }] }),
      entry(2, "ಮನೆ", {
        defs: [{ text: "a building where people live; a house", pos: "noun" }, { text: "house", pos: "noun" }],
      }),
      entry(3, "ಗೃಹ"),
    ]);
    const shard = toReverseShard("h", idx.get("h")!);
    expect(shard.index["house"]).toEqual([
      [2, "ಮನೆ"],
      [3, "ಗೃಹ"],
      [1, "ಅಂಕಣ"],
    ]);
  });
});
