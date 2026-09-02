import { formatEra, latinToKannada, phoneticKey, shardKey, hasKannada, siblingLetters } from "./kannada";

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
