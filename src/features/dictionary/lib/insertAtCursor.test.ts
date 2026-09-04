import { backspaceAtCursor, insertAtCursor } from "./insertAtCursor";

describe("insertAtCursor", () => {
  it("appends at the end when cursor is null", () => {
    expect(insertAtCursor("ಕನ", "ಡ", null)).toEqual({ text: "ಕನಡ", cursor: 3 });
  });

  it("inserts in the middle of the value", () => {
    expect(insertAtCursor("ಕಡ", "ನ", 1)).toEqual({ text: "ಕನಡ", cursor: 2 });
  });

  it("inserts at the very start", () => {
    expect(insertAtCursor("ನಡ", "ಕ", 0)).toEqual({ text: "ಕನಡ", cursor: 1 });
  });

  it("clamps a cursor beyond the value length to the end", () => {
    expect(insertAtCursor("ಕ", "ನ", 99)).toEqual({ text: "ಕನ", cursor: 2 });
  });

  it("clamps a negative cursor to the start", () => {
    expect(insertAtCursor("ನ", "ಕ", -5)).toEqual({ text: "ಕನ", cursor: 1 });
  });
});

describe("backspaceAtCursor", () => {
  it("removes the last character when cursor is null", () => {
    expect(backspaceAtCursor("ಕನ್ನಡ", null)).toEqual({ text: "ಕನ್ನ", cursor: 4 });
  });

  it("removes one code point before the cursor", () => {
    expect(backspaceAtCursor("ಕನಡ", 2)).toEqual({ text: "ಕಡ", cursor: 1 });
  });

  it("removes a combining vowel sign as its own code point", () => {
    // ಕಾ is two code points: ಕ (U+0C95) followed by the ಾ vowel sign (U+0CBE).
    expect(backspaceAtCursor("ಕಾ", null)).toEqual({ text: "ಕ", cursor: 1 });
  });

  it("is a no-op at position 0", () => {
    expect(backspaceAtCursor("ಕನ", 0)).toEqual({ text: "ಕನ", cursor: 0 });
  });

  it("is a no-op on an empty value", () => {
    expect(backspaceAtCursor("", null)).toEqual({ text: "", cursor: 0 });
  });
});
