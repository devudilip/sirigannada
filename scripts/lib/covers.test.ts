import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { COVERS_DIR, COVER_MAX_BYTES, COVER_LICENSES, coverUrl, validateCover } from "./covers";

const SLUG = "basavanna-vachanagalu";

let publicRoot: string;

const validCover = () => ({
  file: `${SLUG}.webp`,
  alt: { kn: "ಬಸವಣ್ಣನವರ ಪ್ರತಿಮೆ", en: "Statue of Basavanna" },
  provenance: {
    source: "https://commons.wikimedia.org/wiki/File:Basavanna_statue.jpg",
    license: "CC-BY-SA-4.0",
    licenseNote: "Photograph by A. Photographer via Wikimedia Commons, CC BY-SA 4.0; cropped, resized and shown with a brand duotone tint.",
    author: "A. Photographer",
    retrieved: "2026-09-19",
  },
});

function writeCover(name: string, bytes: number): void {
  writeFileSync(join(publicRoot, COVERS_DIR, name), Buffer.alloc(bytes, 7));
}

beforeAll(() => {
  publicRoot = mkdtempSync(join(tmpdir(), "sg-covers-"));
  mkdirSync(join(publicRoot, COVERS_DIR), { recursive: true });
  writeCover(`${SLUG}.webp`, 4096);
  writeCover("too-big.webp", COVER_MAX_BYTES + 1);
});

afterAll(() => rmSync(publicRoot, { recursive: true, force: true }));

describe("coverUrl", () => {
  it("serves covers from /data/covers/ so the service worker caches them", () => {
    expect(coverUrl("sarvajna-tripadigalu.webp")).toBe("/data/covers/sarvajna-tripadigalu.webp");
  });
});

describe("COVER_LICENSES", () => {
  it("accepts the older Commons CC versions", () => {
    for (const l of ["CC-BY-2.0", "CC-BY-2.5", "CC-BY-3.0", "CC-BY-SA-2.0", "CC-BY-SA-2.5", "CC-BY-SA-3.0"] as const) {
      expect(COVER_LICENSES).toContain(l);
    }
  });

  it("never allows ODbL for an image", () => {
    expect(COVER_LICENSES).not.toContain("ODbL-1.0");
  });
});

describe("validateCover", () => {
  it("accepts a complete cover whose file exists and is within budget", () => {
    expect(validateCover(validCover(), SLUG, publicRoot)).toEqual([]);
  });

  it("rejects a non-object", () => {
    expect(validateCover("nope", SLUG, publicRoot)).toEqual(["cover: not an object"]);
  });

  it("requires the file name to be <slug>.webp", () => {
    const errors = validateCover({ ...validCover(), file: "cover.webp" }, SLUG, publicRoot);
    expect(errors.some((e) => e.startsWith("cover.file: must be"))).toBe(true);
  });

  it("rejects a missing image file", () => {
    const errors = validateCover({ ...validCover(), file: "ghost.webp" }, "ghost", publicRoot);
    expect(errors).toContain(`cover.file: ${join(COVERS_DIR, "ghost.webp")} is missing from public/`);
  });

  it("rejects an image over the size budget", () => {
    const errors = validateCover({ ...validCover(), file: "too-big.webp" }, "too-big", publicRoot);
    expect(errors.some((e) => e.includes("the limit is 40 KB"))).toBe(true);
  });

  it("requires alt text in both languages", () => {
    const errors = validateCover({ ...validCover(), alt: { kn: "  ", en: "Statue" } }, SLUG, publicRoot);
    expect(errors).toContain("cover.alt.kn: required, non-empty");
    expect(validateCover({ ...validCover(), alt: undefined }, SLUG, publicRoot).some((e) => e.startsWith("cover.alt:"))).toBe(true);
  });

  it("rejects ODbL and any unknown licence", () => {
    for (const license of ["ODbL-1.0", "all-rights-reserved"]) {
      const cover = validCover();
      const errors = validateCover({ ...cover, provenance: { ...cover.provenance, license } }, SLUG, publicRoot);
      expect(errors.some((e) => e.startsWith("cover.provenance.license:"))).toBe(true);
    }
  });

  it("requires an https source, an author and an ISO retrieved date", () => {
    const cover = validCover();
    const errors = validateCover(
      { ...cover, provenance: { ...cover.provenance, source: "http://commons.wikimedia.org/x", author: "", retrieved: "19-09-2026" } },
      SLUG,
      publicRoot,
    );
    expect(errors).toContain("cover.provenance.source: must be an https URL (the Wikimedia Commons file page)");
    expect(errors.some((e) => e.startsWith("cover.provenance.author:"))).toBe(true);
    expect(errors.some((e) => e.startsWith("cover.provenance.retrieved:"))).toBe(true);
  });

  it("makes a public-domain cover explain why it is public domain", () => {
    const cover = validCover();
    const bare = { ...cover, provenance: { ...cover.provenance, license: "public-domain", licenseNote: "Nice photo of a statue." } };
    expect(validateCover(bare, SLUG, publicRoot).some((e) => e.includes("why it is public domain"))).toBe(true);

    const explained = {
      ...cover,
      provenance: { ...cover.provenance, license: "public-domain", licenseNote: "Photographer died 1942; copyright expired. Cropped and tinted." },
    };
    expect(validateCover(explained, SLUG, publicRoot)).toEqual([]);
  });

  it("reports a wholly missing provenance block once", () => {
    const { provenance: _p, ...rest } = validCover();
    expect(validateCover(rest, SLUG, publicRoot)).toEqual(["cover.provenance: missing or not an object"]);
  });
});
