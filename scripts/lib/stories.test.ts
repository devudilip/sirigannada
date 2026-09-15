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

describe("validateStory dev evaluation escape", () => {
  it("lets a git-ignored dev story carry audio under a pending licence, but never by default", async () => {
    const { mkdtempSync, mkdirSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { validateStory } = await import("./stories");
    const root = mkdtempSync(join(tmpdir(), "sg-stories-"));
    mkdirSync(join(root, "data", "stories", "_dev"), { recursive: true });
    writeFileSync(join(root, "data", "stories", "_dev", "x.mp3"), "x");
    const story = {
      slug: "x", title: "x", collection: { kn: "ಸ", en: "c" }, tags: [], durationSec: 10,
      audio: "/data/stories/_dev/x.mp3", art: null,
      provenance: { source: "s", license: "pending-permission" as const, licenseNote: "n", retrieved: "2026-09-09" },
    };
    expect(validateStory(story, root)).toHaveLength(1);
    expect(validateStory(story, root, { allowPendingAudio: true })).toEqual([]);
  });
});

describe("loadStory attaches local audio by convention", () => {
  it("uses public/data/stories/<slug>.mp3 when story.json has no audio and the file exists", async () => {
    const { mkdtempSync, mkdirSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { loadStory } = await import("./stories");
    const root = mkdtempSync(join(tmpdir(), "sg-stories-"));
    const src = join(root, "src", "abc");
    mkdirSync(src, { recursive: true });
    writeFileSync(join(src, "story.json"), JSON.stringify({ title: "t", collection: { kn: "ಸ", en: "c" }, tags: [], durationSec: 5, provenance: { source: "s", license: "pending-permission", licenseNote: "n", retrieved: "2026-09-15" } }));
    expect(loadStory(src, "abc", root).audio).toBeNull();
    mkdirSync(join(root, "data", "stories"), { recursive: true });
    writeFileSync(join(root, "data", "stories", "abc.mp3"), "x");
    expect(loadStory(src, "abc", root).audio).toBe("/data/stories/abc.mp3");
    expect(loadStory(src, "abc").audio).toBeNull();
  });
});

describe("sortStories / pendingFromStories", () => {
  const mk = (title: string, series?: number, audio: string | null = null) => ({
    slug: title, title, collection: { kn: "ಸಂಗ್ರಹ", en: "c" }, series, tags: [], durationSec: 1, audio, art: null,
    provenance: { source: "https://x", license: "pending-permission" as const, licenseNote: "n", retrieved: "2026-09-15" },
  });
  it("orders by series number and groups audio-less titles by source", async () => {
    const { sortStories, pendingFromStories } = await import("./stories");
    const list = [mk("b", 2), mk("a", 1), mk("z")];
    expect(sortStories(list).map((s) => s.title)).toEqual(["a", "b", "z"]);
    const pending = pendingFromStories(list);
    expect(pending).toHaveLength(1);
    expect(pending[0]?.titles.map((t) => t.title)).toEqual(["a", "b", "z"]);
  });
});
