import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Story } from "../../src/lib/types";
import { splitSentences, validateStory } from "./stories";

describe("splitSentences", () => {
  it("splits on lines and on Kannada/Latin sentence punctuation", () => {
    expect(splitSentences("ಒಂದು ಊರು ಇತ್ತು. ಅಲ್ಲಿ ಹಸು ಇತ್ತು!\n\nಅದು ನಕ್ಕಿತು। ಮುಗಿಯಿತು?  ")).toEqual([
      "ಒಂದು ಊರು ಇತ್ತು.",
      "ಅಲ್ಲಿ ಹಸು ಇತ್ತು!",
      "ಅದು ನಕ್ಕಿತು।",
      "ಮುಗಿಯಿತು?",
    ]);
  });

  it("drops blank lines and trims", () => {
    expect(splitSentences("\n  ಹಲೋ  \n\n")).toEqual(["ಹಲೋ"]);
  });
});

function licensed(overrides: Partial<Story> = {}): Story {
  return {
    slug: "punyakoti",
    title: "ಪುಣ್ಯಕೋಟಿ",
    collection: { kn: "ಜನಪದ", en: "Folk" },
    tags: ["animal", "moral"],
    durationSec: 120,
    audio: "/data/stories/punyakoti.mp3",
    art: null,
    provenance: { source: "https://example.org", license: "CC-BY-4.0", licenseNote: "CC BY", retrieved: "2026-09-09" },
    ...overrides,
  };
}

describe("validateStory", () => {
  let root: string;
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "stories-"));
    mkdirSync(join(root, "data", "stories"), { recursive: true });
    writeFileSync(join(root, "data", "stories", "punyakoti.mp3"), "audio");
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it("rejects a pending story that carries audio", () => {
    const story = licensed({ provenance: { ...licensed().provenance, license: "pending-permission" } });
    expect(validateStory(story, root).join("\n")).toMatch(/pending-permission story may not carry/);
  });

  it("rejects a licensed story without audio", () => {
    expect(validateStory(licensed({ audio: null }), root).join("\n")).toMatch(/needs an audio URL/);
  });

  it("rejects timings that do not match the sentences", () => {
    const story = licensed({ sentences: ["ಒಂದು.", "ಎರಡು."], timings: [0] });
    expect(validateStory(story, root).join("\n")).toMatch(/timings must match sentences/);
  });

  it("accepts a valid licensed story whose audio file exists", () => {
    const story = licensed({ sentences: ["ಒಂದು.", "ಎರಡು."], timings: [0, 5] });
    expect(validateStory(story, root)).toEqual([]);
  });

  it("reports a missing audio file", () => {
    expect(validateStory(licensed({ audio: "/data/stories/nope.mp3" }), root).join("\n")).toMatch(/is missing/);
  });
});
