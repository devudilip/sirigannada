import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  attributionLine,
  decodeEntities,
  extractParagraphs,
  parseAttribution,
  pickSize,
  stripHtml,
} from "./storyweaver";

const FIXTURES = join(__dirname, "__fixtures__");
const WRITTEN = readFileSync(join(FIXTURES, "attribution-written.txt"), "utf8");
const TRANSLATED = readFileSync(join(FIXTURES, "attribution-translated.txt"), "utf8");
const PAGE_HTML = readFileSync(join(FIXTURES, "page-story.html"), "utf8");

describe("decodeEntities", () => {
  it("decodes named and numeric entities", () => {
    expect(decodeEntities("Tortoise&#39;s &amp; the Hare&apos;s")).toBe("Tortoise's & the Hare's");
    expect(decodeEntities("A&nbsp;B")).toBe("A B");
  });
});

describe("stripHtml", () => {
  it("removes tags/scripts and collapses all whitespace including newlines", () => {
    expect(stripHtml("<p>ಒಂದು\n<b>ಎರಡು</b></p>\n\n<script>evil()</script>  ಮೂರು")).toBe("ಒಂದು ಎರಡು ಮೂರು");
  });
});

describe("extractParagraphs", () => {
  it("pulls paragraph text out of a real StoryPage's content block", () => {
    const paras = extractParagraphs(PAGE_HTML);
    expect(paras).toHaveLength(1);
    expect(paras[0]).toContain("ಮೊಲ ಮತ್ತು ಆಮೆ ನಡುವೆ ನಡೆದ ಓಟದ ಸ್ಪರ್ಧೆ");
    expect(paras[0]).not.toMatch(/[<>]/);
  });

  it("drops empty paragraphs", () => {
    expect(extractParagraphs("<div class='x content y'><p></p><p>ಆ</p></div><div class=\"page_number\">")).toEqual([
      "ಆ",
    ]);
  });
});

describe("pickSize", () => {
  const sizes = [
    { width: 268, height: 268, url: "a" },
    { width: 548, height: 548, url: "b" },
    { width: 708, height: 708, url: "c" },
    { width: 959, height: 960, url: "d" },
  ];
  it("picks the first size at or above the minimum", () => {
    expect(pickSize(sizes, 700).url).toBe("c");
  });
  it("falls back to the largest when nothing is big enough", () => {
    expect(pickSize(sizes, 5000).url).toBe("d");
  });
});

describe("parseAttribution", () => {
  it("parses a written (non-translated) story's holder/year and image credits", () => {
    const parsed = parseAttribution(WRITTEN);
    expect(parsed.isCcBy).toBe(true);
    expect(parsed.holder).toBe("Pratham Books");
    expect(parsed.year).toBe("2004");
    expect(parsed.donor).toBeNull();
    expect(parsed.imageCredits.length).toBeGreaterThan(0);
    const page2 = parsed.imageCredits.find((c) => c.page === 2);
    expect(page2).toEqual({ page: 2, title: "Animal Kingdom", illustrator: "Padmanabh", holder: "Pratham Books", year: "2004" });
    // "Cover page:" credits are not numbered pages and must not appear.
    expect(parsed.imageCredits.some((c) => Number.isNaN(c.page))).toBe(false);
  });

  it("parses a translated story via the 'lies with' holder/year form", () => {
    const parsed = parseAttribution(TRANSLATED);
    expect(parsed.isCcBy).toBe(true);
    expect(parsed.holder).toBe("Pratham Books");
    expect(parsed.year).toBe("2013");
    const page3 = parsed.imageCredits.find((c) => c.page === 3);
    expect(page3?.illustrator).toBe("Pratyush Gupta");
  });

  it("reports isCcBy false when the license line is absent", () => {
    expect(parseAttribution("This story has no licence statement at all.").isCcBy).toBe(false);
  });
});

describe("attributionLine", () => {
  it("builds the non-translated form", () => {
    const line = attributionLine({
      title: "ಮೊಲ ಮತ್ತು ಆಮೆ",
      language: "Kannada",
      translators: [],
      authors: ["Venkatramana Gowda"],
      illustrators: ["Padmanabh"],
      publisher: "Pratham Books",
      holder: "Pratham Books",
      year: "2004",
    });
    expect(line).toBe(
      "ಮೊಲ ಮತ್ತು ಆಮೆ (Kannada), written by Venkatramana Gowda, illustrated by Padmanabh, published by Pratham Books (© Pratham Books, 2004) under a CC BY 4.0 license on StoryWeaver. Read, create and translate stories for free on www.storyweaver.org.in",
    );
  });

  it("builds the translated form with the original title and a donor credit", () => {
    const line = attributionLine({
      title: "ಯಾರದು?",
      language: "Kannada",
      translators: ["Bhavya"],
      originalTitle: "Who is it?",
      authors: ["Kanchan Bannerjee"],
      illustrators: ["Pratyush Gupta"],
      donor: "Example Foundation",
      publisher: "Pratham Books",
      holder: "Pratham Books",
      year: "2013",
    });
    expect(line).toBe(
      "ಯಾರದು? (Kannada), translated by Bhavya, based on original story Who is it?, written by Kanchan Bannerjee, illustrated by Pratyush Gupta, supported by Example Foundation, published by Pratham Books (© Pratham Books, 2013) under a CC BY 4.0 license on StoryWeaver. Read, create and translate stories for free on www.storyweaver.org.in",
    );
  });
});
