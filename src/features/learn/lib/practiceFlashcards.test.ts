import { buildFlashcardDeck } from "./practiceFlashcards";

describe("buildFlashcardDeck", () => {
  it("returns every word, shuffled", () => {
    const words = ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ"];
    const deck = buildFlashcardDeck(words, 1);
    expect([...deck].sort()).toEqual([...words].sort());
  });

  it("does not mutate the input", () => {
    const words = ["ಅ", "ಆ", "ಇ"];
    const copy = [...words];
    buildFlashcardDeck(words, 1);
    expect(words).toEqual(copy);
  });

  it("is deterministic for the same seed", () => {
    const words = ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ"];
    expect(buildFlashcardDeck(words, 4)).toEqual(buildFlashcardDeck(words, 4));
  });

  it("handles an empty list", () => {
    expect(buildFlashcardDeck([], 1)).toEqual([]);
  });
});
