import { toDictEntry } from "./entry";
import type { AlarEntry } from "./alar";

function raw(over: Partial<AlarEntry> = {}): AlarEntry {
  return {
    id: 7,
    entry: "ಮನೆ",
    phone: "mane",
    defs: [{ id: 1, entry: "a house", type: "noun" }],
    ...over,
  };
}

describe("toDictEntry", () => {
  it("maps headword, phone, key, and definitions", () => {
    const entry = toDictEntry(raw());
    expect(entry).toMatchObject({ id: 7, word: "ಮನೆ", phone: "mane" });
    expect(entry?.defs).toEqual([{ text: "a house", pos: "noun" }]);
  });

  it("copies origin when the source records one", () => {
    expect(toDictEntry(raw({ origin: "Skt" }))?.origin).toBe("Skt");
    expect(toDictEntry(raw({ origin: " Persian " }))?.origin).toBe("Persian");
  });

  it("leaves origin unset when Alar's field is empty or missing", () => {
    expect(toDictEntry(raw({ origin: "" }))).not.toHaveProperty("origin");
    expect(toDictEntry(raw({ origin: "   " }))).not.toHaveProperty("origin");
    expect(toDictEntry(raw())).not.toHaveProperty("origin");
  });

  it("flags a truncated headword", () => {
    expect(toDictEntry(raw({ entry: "ಅಭ್ಯು", phone: "abhyukṣaṇa" }))?.truncated).toBe(true);
    expect(toDictEntry(raw())).not.toHaveProperty("truncated");
  });

  it("skips records with no Kannada headword and no definitions", () => {
    expect(toDictEntry(raw({ entry: "1" }))).toBeUndefined();
    expect(toDictEntry(raw({ defs: [] }))).toBeUndefined();
    expect(toDictEntry(raw({ defs: [{ id: 2, entry: "  ", type: "noun" }] }))).toBeUndefined();
  });
});
