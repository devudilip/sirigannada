import {
  formatEra,
  latinToKannada,
  phoneticKey,
  secondCharKey,
  shardKey,
  hasKannada,
  siblingLetters,
  splitAksharas,
} from "./kannada";

describe("siblingLetters", () => {
  it("groups sibilants and aspirates", () => {
    expect(siblingLetters("ಸ")).toEqual(expect.arrayContaining(["ಸ", "ಶ", "ಷ"]));
    expect(siblingLetters("ಕ")).toEqual(expect.arrayContaining(["ಕ", "ಖ"]));
    expect(siblingLetters("ಮ")).toEqual(["ಮ"]);
  });
});

describe("shardKey", () => {
  it("returns the first Kannada letter", () => {
    expect(shardKey("ಕನ್ನಡ")).toBe("ಕ");
    expect(shardKey("ಅಂಕ")).toBe("ಅ");
  });
  it("returns _ for non-Kannada", () => {
    expect(shardKey("hello")).toBe("_");
    expect(shardKey("")).toBe("_");
  });
});

describe("secondCharKey", () => {
  it("returns the word's second character verbatim, including vowel signs", () => {
    expect(secondCharKey("ಕನ್ನಡ")).toBe("ನ");
    expect(secondCharKey("ಕಾಗದ")).toBe("ಾ");
    expect(secondCharKey("ಕಿತ್ತಳೆ")).toBe("ಿ");
  });
  it("returns _ for a single-character word or empty string", () => {
    expect(secondCharKey("ಕ")).toBe("_");
    expect(secondCharKey("")).toBe("_");
  });
});

describe("phoneticKey", () => {
  it("folds sibilants and vowel length", () => {
    expect(phoneticKey("ಶಾಲೆ")).toBe(phoneticKey("ಸಾಲೆ"));
    expect(phoneticKey("ಶಾಲೆ")).toBe(phoneticKey("ಸಲೆ"));
  });
  it("collapses doubled consonants", () => {
    expect(phoneticKey("ಕನ್ನಡ")).toBe(phoneticKey("ಕನಡ"));
  });
  it("folds aspirates and retroflexes", () => {
    expect(phoneticKey("ಭಾಷೆ")).toBe(phoneticKey("ಬಸೆ"));
    expect(phoneticKey("ಹಳೆ")).toBe(phoneticKey("ಹಲೆ"));
  });
});

describe("latinToKannada", () => {
  it("handles simple CV syllables", () => {
    expect(latinToKannada("kavi")).toBe("ಕವಿ");
    expect(latinToKannada("mane")).toBe("ಮನೆ");
  });
  it("handles conjuncts and retroflex", () => {
    expect(latinToKannada("kannaDa")).toBe("ಕನ್ನಡ");
  });
  it("handles independent vowels and trailing consonants", () => {
    expect(latinToKannada("amma")).toBe("ಅಮ್ಮ");
    expect(latinToKannada("bas")).toBe("ಬಸ್");
  });
  it("handles long vowels", () => {
    expect(latinToKannada("shaale")).toBe("ಶಾಲೆ");
    expect(latinToKannada("hoovu")).toBe("ಹೂವು");
  });
});

describe("hasKannada", () => {
  it("detects script", () => {
    expect(hasKannada("ಕ")).toBe(true);
    expect(hasKannada("ka")).toBe(false);
  });
});

describe("formatEra", () => {
  it("localises centuries to Kannada ordinals", () => {
    expect(formatEra("12th century", "kn")).toBe("೧೨ನೇ ಶತಮಾನ");
    expect(formatEra("15th century", "kn")).toBe("೧೫ನೇ ಶತಮಾನ");
  });
  it("converts bare years to Kannada digits", () => {
    expect(formatEra("1924", "kn")).toBe("೧೯೨೪");
  });
  it("passes English and unknown shapes through", () => {
    expect(formatEra("12th century", "en")).toBe("12th century");
    expect(formatEra("c. 1900", "kn")).toBe("c. 1900");
  });
});

describe("splitAksharas", () => {
  it("splits everyday words into orthographic syllables, not grapheme clusters", () => {
    expect(splitAksharas("ಕನ್ನಡ")).toEqual(["ಕ", "ನ್ನ", "ಡ"]);
    expect(splitAksharas("ಕರ್ನಾಟಕ")).toEqual(["ಕ", "ರ್ನಾ", "ಟ", "ಕ"]);
    expect(splitAksharas("ಸಂತೋಷ")).toEqual(["ಸಂ", "ತೋ", "ಷ"]);
    expect(splitAksharas("ಪುಸ್ತಕ")).toEqual(["ಪು", "ಸ್ತ", "ಕ"]);
    expect(splitAksharas("ಕಾರ್ಯಕ್ರಮ")).toEqual(["ಕಾ", "ರ್ಯ", "ಕ್ರ", "ಮ"]);
    expect(splitAksharas("ಅಮ್ಮ")).toEqual(["ಅ", "ಮ್ಮ"]);
    expect(splitAksharas("ವಿದ್ಯಾರ್ಥಿ")).toEqual(["ವಿ", "ದ್ಯಾ", "ರ್ಥಿ"]);
  });

  it("handles more real dictionary words", () => {
    expect(splitAksharas("ಮನೆ")).toEqual(["ಮ", "ನೆ"]);
    expect(splitAksharas("ಶಾಲೆ")).toEqual(["ಶಾ", "ಲೆ"]);
    expect(splitAksharas("ಅಕ್ಷರ")).toEqual(["ಅ", "ಕ್ಷ", "ರ"]);
    expect(splitAksharas("ಪ್ರೀತಿ")).toEqual(["ಪ್ರೀ", "ತಿ"]);
  });

  it("returns the akshara counts matching their known length", () => {
    expect(splitAksharas("ಕನ್ನಡ")).toHaveLength(3);
    expect(splitAksharas("ಕರ್ನಾಟಕ")).toHaveLength(4);
  });

  it("handles the empty string", () => {
    expect(splitAksharas("")).toEqual([]);
  });

  it("handles a single akshara", () => {
    expect(splitAksharas("ಕ")).toEqual(["ಕ"]);
    expect(splitAksharas("ಅ")).toEqual(["ಅ"]);
  });

  it("does not drop a leading vowel sign in malformed input, keeping the string reconstructible", () => {
    // A vowel sign with nothing before it is not valid Kannada, but we still round-trip it
    // rather than silently discarding a codepoint: it opens its own (degenerate) akshara.
    expect(splitAksharas("ಾಕ")).toEqual(["ಾ", "ಕ"]);
    expect(splitAksharas("ಾ")).toEqual(["ಾ"]);
  });

  it("always reconstructs the original string when joined", () => {
    for (const word of ["ಕನ್ನಡ", "ಕರ್ನಾಟಕ", "ಅಮ್ಮ", "ಸಂತೋಷ", "ಾಕ", ""]) {
      expect(splitAksharas(word).join("")).toBe(word);
    }
  });
});
