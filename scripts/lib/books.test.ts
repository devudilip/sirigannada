import { describe, expect, it } from "vitest";
import {
  chapterId,
  eraSortKey,
  findDisallowedChars,
  isHttpUrl,
  isIsoDate,
  parseChapter,
  splitBlocks,
  validateBookMeta,
  validateChapterText,
} from "./books";

const validMeta = {
  slug: "sarvajna-tripadigalu",
  title: "ಸರ್ವಜ್ಞನ ತ್ರಿಪದಿಗಳು",
  author: "ಸರ್ವಜ್ಞ",
  era: "16th century",
  form: "tripadi",
  description: "ಆಯ್ದ ತ್ರಿಪದಿಗಳು.",
  provenance: {
    source: "https://kn.wikisource.org/wiki/ಸರ್ವಜ್ಞನ_ವಚನಗಳು",
    license: "public-domain",
    licenseNote: "Author died c. 1601; Kannada Wikisource edition",
    author: "ಸರ್ವಜ್ಞ",
    authorDied: 1601,
    retrieved: "2026-09-02",
  },
};

describe("splitBlocks", () => {
  it("splits on blank lines and keeps inner newlines", () => {
    const text = "ಸಾಲು ಒಂದು\nಸಾಲು ಎರಡು\n\nಎರಡನೆಯ ವಚನ\n";
    expect(splitBlocks(text)).toEqual(["ಸಾಲು ಒಂದು\nಸಾಲು ಎರಡು", "ಎರಡನೆಯ ವಚನ"]);
  });

  it("treats multiple blank lines and whitespace-only lines as one separator", () => {
    expect(splitBlocks("ಅ\n\n\n\nಆ\n  \nಇ")).toEqual(["ಅ", "ಆ", "ಇ"]);
  });

  it("normalises to NFC, trims lines and handles CRLF", () => {
    const decomposed = "\u0C95\u0CC6\u0CD6"; // ಕೆ + ೖ → ಕೈ under NFC
    expect(splitBlocks(`  ${decomposed}  \r\n\r\nಬ`)).toEqual(["\u0C95\u0CC8", "ಬ"]);
  });

  it("returns [] for empty input", () => {
    expect(splitBlocks("\n\n  \n")).toEqual([]);
  });
});

describe("parseChapter / chapterId", () => {
  it("uses first line as title and the rest as blocks", () => {
    const ch = parseChapter("03-Neeti Paddhati.txt", "ನೀತಿ ಪದ್ಧತಿ\n\nಒಂದು\nಎರಡು\n\nಮೂರು\n");
    expect(ch.id).toBe("03-neeti-paddhati");
    expect(ch.title).toBe("ನೀತಿ ಪದ್ಧತಿ");
    expect(ch.blocks).toEqual(["ಒಂದು\nಎರಡು", "ಮೂರು"]);
  });

  it("rejects file names without the NN- prefix", () => {
    expect(() => chapterId("intro.txt")).toThrow();
  });
});

describe("validateChapterText", () => {
  it("accepts clean Kannada verse with danda punctuation", () => {
    expect(validateChapterText("01-a.txt", "ಶೀರ್ಷಿಕೆ\n\nಸಾಲು । ಸಾಲು ॥೧॥\n")).toEqual([]);
  });

  it("flags missing title and empty body", () => {
    const errors = validateChapterText("01-a.txt", "\n\n");
    expect(errors.some((e) => e.includes("title"))).toBe(true);
    expect(errors.some((e) => e.includes("no text blocks"))).toBe(true);
  });

  it("flags wiki markup and HTML", () => {
    for (const body of ["{{ಪರಿವಿಡಿ}}", "[[ವರ್ಗ:ಅ]]", "ಅ<br>ಆ", "''ಅ''"]) {
      expect(validateChapterText("01-a.txt", `ಶೀರ್ಷಿಕೆ\n\n${body}`)).toEqual(
        expect.arrayContaining([expect.stringContaining("contains markup")]),
      );
    }
    expect(validateChapterText("01-a.txt", "ಶೀರ್ಷಿಕೆ\n\nಅ * ಆ")).toEqual([expect.stringContaining("disallowed")]);
  });

  it("flags broken legacy-font conversions (two vowel signs in a row)", () => {
    const errors = validateChapterText("01-a.txt", "ಶೀರ್ಷಿಕೆ\n\nಕುಂಬಳದ ಕಾುಗೆ ಕಬ್ಬುನದ ಕಟ್ಟ");
    expect(errors).toEqual([expect.stringContaining("ಕಾುಗೆ")]);
    expect(validateChapterText("01-a.txt", "ಶೀರ್ಷಿಕೆ\n\nಕುಂಬಳದ ಕಾಯಿಗೆ ಕಬ್ಬುನದ ಕಟ್ಟ")).toEqual([]);
  });

  it("flags characters outside Kannada/Latin/punctuation", () => {
    expect(findDisallowedChars("ಕನ್ನಡ abc 123 ।॥ — “x”")).toEqual([]);
    expect(findDisallowedChars("ಕನ್ನಡ नमः")).toContain("न");
    const errors = validateChapterText("01-a.txt", "ಶೀರ್ಷಿಕೆ\n\nಅ नमः");
    expect(errors[0]).toMatch(/disallowed characters/);
  });
});

describe("validateBookMeta", () => {
  it("accepts a complete public-domain book", () => {
    expect(validateBookMeta(validMeta, "sarvajna-tripadigalu")).toEqual([]);
  });

  it("requires authorDied ≤ 1965 for public-domain", () => {
    const meta = { ...validMeta, provenance: { ...validMeta.provenance, authorDied: 1994 } };
    expect(validateBookMeta(meta)).toEqual([expect.stringContaining("not public domain")]);
    const { authorDied: _drop, ...noDeath } = validMeta.provenance;
    expect(validateBookMeta({ ...validMeta, provenance: noDeath })).toEqual([
      expect.stringContaining("authorDied: required"),
    ]);
  });

  it("rejects unknown licences, bad URLs, bad dates, bad forms and slug mismatch", () => {
    const bad = {
      ...validMeta,
      form: "novel",
      provenance: { ...validMeta.provenance, license: "CC-BY-NC-4.0", source: "wikisource", retrieved: "2 Sep 2026" },
    };
    const errors = validateBookMeta(bad, "other-slug");
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("slug"),
        expect.stringContaining("form"),
        expect.stringContaining("license"),
        expect.stringContaining("source"),
        expect.stringContaining("retrieved"),
      ]),
    );
  });

  it("reports missing required fields", () => {
    expect(validateBookMeta({})).toEqual(
      expect.arrayContaining([expect.stringContaining("slug"), expect.stringContaining("provenance")]),
    );
  });
});

describe("small helpers", () => {
  it("isIsoDate / isHttpUrl", () => {
    expect(isIsoDate("2026-09-02")).toBe(true);
    expect(isIsoDate("2026-13-40")).toBe(false);
    expect(isHttpUrl("https://kn.wikisource.org/wiki/ಅ")).toBe(true);
    expect(isHttpUrl("ftp://x")).toBe(false);
  });

  it("eraSortKey orders centuries before later years", () => {
    expect(eraSortKey("12th century")).toBeLessThan(eraSortKey("15th century"));
    expect(eraSortKey("15th century")).toBeLessThan(eraSortKey("c. 1600"));
    expect(eraSortKey("1917")).toBe(1917);
  });
});
