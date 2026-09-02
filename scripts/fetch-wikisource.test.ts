import { describe, expect, it } from "vitest";
import { pageToBlocks, parseSources, reflowSentences, splitPageLine } from "./fetch-wikisource";

describe("parseSources", () => {
  it("reads chapter headers with options and page lines; ignores plain comments", () => {
    const specs = parseSources(`# a comment without pipe
# 01-a.txt | ಭಾಗ ೧ | blocks | reflow
ಚಕೋರಂಗೆ ಚಂದ್ರಮನ
# 02-b.txt | ನೀತಿ | page | section=ನೀತಿ | max=40 | skip=2
ಸರ್ವಜ್ಞನ ವಚನಗಳು
`);
    expect(specs).toHaveLength(2);
    expect(specs[0]).toMatchObject({ file: "01-a.txt", title: "ಭಾಗ ೧", mode: "blocks", reflow: true });
    expect(specs[0]?.pages).toEqual(["ಚಕೋರಂಗೆ ಚಂದ್ರಮನ"]);
    expect(specs[1]).toMatchObject({ mode: "page", section: "ನೀತಿ", max: 40, skip: 2 });
  });

  it("rejects unknown options", () => {
    expect(() => parseSources("# 01.txt | t | bogus")).toThrow(/Unknown option/);
  });
});

describe("splitPageLine", () => {
  it("splits 'title # section' and leaves plain titles alone", () => {
    expect(splitPageLine("ಸರ್ವಜ್ಞನ ವಚನಗಳು # ಲೇಸು ಪದ್ಧತಿ")).toEqual(["ಸರ್ವಜ್ಞನ ವಚನಗಳು", "ಲೇಸು ಪದ್ಧತಿ"]);
    expect(splitPageLine("ಚಕೋರಂಗೆ ಚಂದ್ರಮನ")).toEqual(["ಚಕೋರಂಗೆ ಚಂದ್ರಮನ", undefined]);
  });
});

describe("pageToBlocks", () => {
  it("strips leading and trailing serial numbers in page mode", () => {
    const cleaned = "## ಲೇಸು\n೯೪೧. ಹಂಗಿನಾ ಹಾಲಿನಿಂ । ದಂಬಲಿಯ ತಿಳಿ ಲೇಸು ।\nತಂಗುಳವೆ ಲೇಸು ಸರ್ವಜ್ಞ ॥\n\n೯೪೨. ಜಾಜಿಯಾ ಹೂ ಲೇಸು\nಮಾಜುವದು ಲೇಸು ಸರ್ವಜ್ಞ ॥";
    const blocks = pageToBlocks(cleaned, { file: "x", title: "x", mode: "page", section: "ಲೇಸು", pages: [] });
    expect(blocks).toEqual([
      "ಹಂಗಿನಾ ಹಾಲಿನಿಂ । ದಂಬಲಿಯ ತಿಳಿ ಲೇಸು ।\nತಂಗುಳವೆ ಲೇಸು ಸರ್ವಜ್ಞ ॥",
      "ಜಾಜಿಯಾ ಹೂ ಲೇಸು\nಮಾಜುವದು ಲೇಸು ಸರ್ವಜ್ಞ ॥",
    ]);
  });

  it("makes one block per page in blocks mode and drops the trailing editorial number", () => {
    const blocks = pageToBlocks("ಕಳಬೇಡ ಕೊಲಬೇಡ\nಇದೇ ಅಂತರಂಗಶುದ್ಧಿ\nಕೂಡಲಸಂಗಮದೇವ. 235", {
      file: "x",
      title: "x",
      mode: "blocks",
      pages: [],
    });
    expect(blocks).toEqual(["ಕಳಬೇಡ ಕೊಲಬೇಡ\nಇದೇ ಅಂತರಂಗಶುದ್ಧಿ\nಕೂಡಲಸಂಗಮದೇವ"]);
  });

  it("in blocks mode drops modern intro that is not in a poem and not labelled ತಾತ್ಪರ್ಯ", () => {
    const cleaned = `ಲೋಕದ ಕಾಳಜಿ ಸಂತ ಶಿಶುನಾಳ ಷರೀಫ್ ರವರು ರಚಿಸಿರುವ ಒಂದು ಗೀತೆ. ಗೀತೆಯು ಉತ್ತರ ಕರ್ನಾಟಕದ ಉಪಭಾಷೆಯಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ.

## ಗೀತೆ
ಲೋಕದ ಕಾಳಜಿ ಮಾಡತೇನಂತಿ
ನಿಂಗ್ಯಾರ್ ಬ್ಯಾಡಾಂತಾರ, ಮಾದಪ್ಪ ಚಿಂತಿ!
[ಲೋಕದ ಕಾಳಜಿ...]
ನೀ ಮಾಡೋದು ಘಳಿಗಿ ಸಂತಿ

## ಉಲ್ಲೇಖಗಳು
ಎನ್. ಎಸ್. ಲಕ್ಷ್ಮೀನಾರಾಯಣ ಭಟ್ಟ`;
    const blocks = pageToBlocks(cleaned, { file: "x", title: "x", mode: "blocks", pages: [] });
    expect(blocks).toEqual([
      "ಲೋಕದ ಕಾಳಜಿ ಮಾಡತೇನಂತಿ\nನಿಂಗ್ಯಾರ್ ಬ್ಯಾಡಾಂತಾರ, ಮಾದಪ್ಪ ಚಿಂತಿ!\nನೀ ಮಾಡೋದು ಘಳಿಗಿ ಸಂತಿ",
    ]);
  });
});

describe("reflowSentences", () => {
  it("leaves blocks alone when lines already end at sentence boundaries", () => {
    const block = "ಕಳಬೇಡ ಕೊಲಬೇಡ\nಹುಸಿಯ ನುಡಿಯಲು ಬೇಡ\nಇದೇ ಅಂತರಂಗಶುದ್ಧಿ.";
    expect(reflowSentences(block)).toBe(block);
  });

  it("rejoins comma-split clauses into one line per sentence when short enough", () => {
    const block = "ಅಕ್ಕ ಕೇಳಕ್ಕಾ\nನಾನೊಂದು ಕನಸ ಕಂಡೆ. ಚಿಕ್ಕ ಚಿಕ್ಕ ಜಡೆಗಳ ಗೊರವನ ಕಂಡೆ.\nಆತನನಪ್ಪಿಕೊಂಡು\nತಳವೆಳಗಾದೆನು.";
    expect(reflowSentences(block)).toBe(
      "ಅಕ್ಕ ಕೇಳಕ್ಕಾ ನಾನೊಂದು ಕನಸ ಕಂಡೆ.\nಚಿಕ್ಕ ಚಿಕ್ಕ ಜಡೆಗಳ ಗೊರವನ ಕಂಡೆ.\nಆತನನಪ್ಪಿಕೊಂಡು ತಳವೆಳಗಾದೆನು.",
    );
  });

  it("keeps clause lines when the joined sentence would be too long", () => {
    const long = Array.from({ length: 4 }, (_, i) => `ಇದು ಬಹಳ ಉದ್ದವಾದ ಪದಗಳ ಸಾಲು ${i}`);
    const block = `${long.join("\n")}. ಮುಂದೆ.`;
    const out = reflowSentences(block).split("\n");
    expect(out).toHaveLength(5);
    expect(out.at(-1)).toBe("ಮುಂದೆ.");
  });
});
