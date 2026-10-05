import { LETTER_WORDS } from "./letterWords";
import { makeRng } from "./practiceRandom";
import { HEARABLE_LETTERS, buildFirstLetterDeck, buildHearLetterDeck, confusableLetters } from "./practiceListen";

describe("HEARABLE_LETTERS", () => {
  it("is every letter with a recording", () => {
    expect(HEARABLE_LETTERS).toHaveLength(49);
  });
});

describe("confusableLetters", () => {
  it("puts the confusable partner first", () => {
    expect(confusableLetters("ಡ", HEARABLE_LETTERS, makeRng(1))[0]).toBe("ದ");
    expect(confusableLetters("ಳ", HEARABLE_LETTERS, makeRng(1))[0]).toBe("ಲ");
  });

  it("fills from the same chart row", () => {
    const wrong = confusableLetters("ಕ", HEARABLE_LETTERS, makeRng(3));
    expect(wrong).toHaveLength(3);
    for (const l of wrong) expect(["ಖ", "ಗ", "ಘ", "ಙ"]).toContain(l);
  });

  it("never offers the answer and stays inside the pool", () => {
    const pool = ["ಕ", "ಖ", "ಅ", "ಮ"];
    expect(confusableLetters("ಕ", pool, makeRng(5)).sort()).toEqual(["ಅ", "ಖ", "ಮ"].sort());
  });
});

describe.each([
  ["buildHearLetterDeck", buildHearLetterDeck],
  ["buildFirstLetterDeck", buildFirstLetterDeck],
])("%s", (_, build) => {
  it("builds distinct questions with 4 unique choices including the answer", () => {
    const deck = build(2, 10);
    expect(deck).toHaveLength(10);
    for (const q of deck) {
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices[q.correctIndex]).toBe(q.letter);
    }
  });

  it("is deterministic for the same seed", () => {
    expect(build(7, 8)).toEqual(build(7, 8));
  });
});

it("first-letter questions use a pictured word filed under the answer", () => {
  for (const q of buildFirstLetterDeck(4, 20)) {
    expect(q.word?.picture).toBeTruthy();
    expect(LETTER_WORDS[q.letter]).toContainEqual(q.word);
  }
});
