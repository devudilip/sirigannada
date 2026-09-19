import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { PictureBook } from "../../src/lib/types";
import { countWords, sortPicturebooks, validatePicturebook } from "./picturebooks";

function book(overrides: Partial<PictureBook> = {}): PictureBook {
  return {
    slug: "797-mola-mattu-aame",
    title: "ಮೊಲ ಮತ್ತು ಆಮೆ",
    level: "3",
    description: "ಕಥೆ",
    orientation: "landscape",
    cover: { src: "/data/picturebooks/797-mola-mattu-aame/cover.jpg", width: 548, height: 548 },
    pages: [{ n: 1, image: { src: "/data/picturebooks/797-mola-mattu-aame/p01.jpg", width: 708, height: 339 }, text: ["ಒಂದು ಕಥೆ."] }],
    audio: null,
    wordCount: 2,
    provenance: {
      source: "https://storyweaver.org.in/en/stories/797-mola-mattu-aame",
      license: "CC-BY-4.0",
      licenseNote: "Fetched from StoryWeaver's public API.",
      storyweaverId: 797,
      authors: ["Venkatramana Gowda"],
      illustrators: ["Padmanabh"],
      translators: [],
      publisher: "Pratham Books",
      publishedYear: "2004",
      attributionLine: "ಮೊಲ ಮತ್ತು ಆಮೆ (Kannada), published under a CC BY 4.0 license on StoryWeaver.",
      imageCredits: [],
      retrieved: "2026-09-15",
    },
    ...overrides,
  };
}

describe("countWords", () => {
  it("counts words across all paragraphs", () => {
    expect(countWords([{ n: 1, image: null, text: ["ಒಂದು ಎರಡು", "ಮೂರು"] }])).toBe(3);
  });
  it("ignores empty paragraphs", () => {
    expect(countWords([{ n: 1, image: null, text: ["", "  "] }])).toBe(0);
  });
});

describe("sortPicturebooks", () => {
  it("orders by level ascending then title in Kannada collation", () => {
    const a = { level: "2", title: "ಬ" };
    const b = { level: "1", title: "ಅ" };
    const c = { level: "1", title: "ಆ" };
    expect(sortPicturebooks([a, b, c])).toEqual([b, c, a]);
  });
});

describe("validatePicturebook", () => {
  let root: string;
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "picturebooks-"));
    const dir = join(root, "data", "picturebooks", "797-mola-mattu-aame");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "cover.jpg"), "img");
    writeFileSync(join(dir, "p01.jpg"), "img");
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it("accepts a valid book", () => {
    expect(validatePicturebook(book(), root)).toEqual([]);
  });

  it("rejects a non-kebab-case slug", () => {
    expect(validatePicturebook(book({ slug: "Not_Kebab" }), root).join("\n")).toMatch(/kebab-case/);
  });

  it("rejects a bad level", () => {
    expect(validatePicturebook(book({ level: "9" as never }), root).join("\n")).toMatch(/level must be/);
  });

  it("rejects a missing cover file", () => {
    expect(validatePicturebook(book({ cover: { src: "/data/picturebooks/797-mola-mattu-aame/missing.jpg", width: 1, height: 1 } }), root).join("\n")).toMatch(
      /cover file .* is missing/,
    );
  });

  it("rejects a page with neither text nor image", () => {
    expect(validatePicturebook(book({ pages: [{ n: 1, image: null, text: [] }] }), root).join("\n")).toMatch(/neither text nor an image/);
  });

  it("rejects a page image that does not exist on disk", () => {
    const b = book({ pages: [{ n: 1, image: { src: "/data/picturebooks/797-mola-mattu-aame/missing.jpg", width: 1, height: 1 }, text: [] }] });
    expect(validatePicturebook(b, root).join("\n")).toMatch(/image .* is missing/);
  });

  it("rejects a non-CC-BY-4.0 license", () => {
    expect(validatePicturebook(book({ provenance: { ...book().provenance, license: "public-domain" as never } }), root).join("\n")).toMatch(
      /license must be CC-BY-4\.0/,
    );
  });

  it("rejects a source that is not a storyweaver.org.in URL", () => {
    expect(validatePicturebook(book({ provenance: { ...book().provenance, source: "https://example.com/story" } }), root).join("\n")).toMatch(
      /storyweaver\.org\.in URL/,
    );
  });

  it("rejects an attribution line that does not mention CC BY 4.0", () => {
    expect(validatePicturebook(book({ provenance: { ...book().provenance, attributionLine: "No license mentioned here." } }), root).join("\n")).toMatch(
      /must mention CC BY 4\.0/,
    );
  });

  it("rejects empty authors or illustrators", () => {
    expect(validatePicturebook(book({ provenance: { ...book().provenance, authors: [] } }), root).join("\n")).toMatch(/authors must be non-empty/);
  });

  it("requires audio to exist and be same-origin when present", () => {
    const b = book({ audio: { src: "/data/picturebooks/other-slug/audio.mp3", durationSec: 10 } });
    const errs = validatePicturebook(b, root).join("\n");
    expect(errs).toMatch(/same-origin/);
    expect(errs).toMatch(/audio file .* is missing/);
  });
});
