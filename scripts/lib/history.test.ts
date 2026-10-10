import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { sha256 } from "./children";
import { historyImageDigest, validateHistory, validateHistoryImage, validateHistorySeries, validateHistoryStory } from "./history";
import { storyboardDimensions } from "./storyboard";

/** A WebP with a VP8L header announcing `width`×`height` and `bytes` of padding: enough for the dimension reader. */
function fakeWebp(width: number, height: number, bytes = 4000): Buffer {
  const bits = (width - 1) | ((height - 1) << 14);
  const chunk = Buffer.alloc(5 + bytes);
  chunk[0] = 0x2f;
  chunk.writeUInt32LE(bits >>> 0, 1);
  const header = Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8L"), Buffer.alloc(4)]);
  header.writeUInt32LE(4 + 8 + chunk.length, 4);
  header.writeUInt32LE(chunk.length, 16);
  return Buffer.concat([header, chunk]);
}

const SERIES = "kadamba";
const SLUG = "mayurasharma";
const dir = `/history/${SERIES}/${SLUG}/`;
const fact = (id: string, tier: string, extra: Record<string, unknown> = {}) => ({
  id, tier, source: "Talagunda pillar inscription, Epigraphia Indica VIII, pp. 24 to 36 (Kielhorn 1905)",
  url: "https://example.org/talagunda", text: { kn: `ಸಂಗತಿ ${id}`, en: `Fact ${id}` }, ...extra,
});
const story = () => ({
  slug: SLUG, series: SERIES, order: 1, era: "345 to 365", age: "12+", language: "kn",
  title: { kn: "ಮಯೂರಶರ್ಮ", en: "Mayurasharma" },
  subtitle: { kn: "ಮಯೂರಶರ್ಮ, ೩೪೫", en: "Mayurasharma, 345" },
  teaser: { kn: "ಕಂಚಿಯಲ್ಲಿ ಅವಮಾನಿತನಾದ ವಿದ್ಯಾರ್ಥಿ ರಾಜನಾದ ಕಥೆ.", en: "The student insulted at Kanchi who became a king." },
  cover: `${dir}cover.webp`,
  introduction: ["ಬನವಾಸಿಯ ಕಥೆ ಇಲ್ಲಿ ಆರಂಭ."],
  scenes: [
    { id: "kanchi", title: "ಕಂಚಿಯಲ್ಲಿ", paragraphs: ["ಮಯೂರಶರ್ಮ ಕಂಚಿಗೆ ಹೋದ.", "ಅಲ್ಲಿ ಅವಮಾನವಾಯಿತು."], image: `${dir}scene-01.webp`,
      imageAlt: { kn: "ಕಂಚಿಯ ಘಟಿಕೆ", en: "The college at Kanchi" }, facts: ["f-kanchi"], dramatised: ["ಅವನು ಹೇಳಿದ ಮಾತು ಕಲ್ಪಿತ."] },
    { id: "sword", title: "ಖಡ್ಗ", paragraphs: ["ಸೌಟು ಹಿಡಿದ ಕೈ ಖಡ್ಗ ಹಿಡಿಯಿತು."], image: `${dir}scene-02.webp`,
      imageAlt: { kn: "ಖಡ್ಗ ಹಿಡಿದ ಮಯೂರಶರ್ಮ", en: "Mayurasharma takes up the sword" }, facts: ["f-sword", "f-legend"] },
  ],
  summary: ["ಹೀಗೆ ಕದಂಬ ವಂಶ ಹುಟ್ಟಿತು."],
  didYouKnow: ["f-kanchi", "f-sword"],
  visitToday: [{ place: "ತಾಳಗುಂದ", what: "ಪ್ರಣವೇಶ್ವರ ದೇವಾಲಯದ ಮುಂದಿನ ಶಾಸನ ಸ್ತಂಭ.", url: "https://example.org/map" }],
  facts: [fact("f-kanchi", "inscription", { quote: "..." }), fact("f-sword", "inscription"), fact("f-legend", "legend", { disputed: { kn: "ಕಾಲ ವಿವಾದಿತ.", en: "Date disputed." } })],
  provenance: { source: "https://github.com/example/sirigannada", license: "CC-BY-SA-4.0", licenseNote: "Original text, CC BY-SA 4.0", retrieved: "2026-10-10" },
  illustrations: { generator: "Codex image_generation", promptDir: "prompts", disclosure: { kn: "ಚಿತ್ರಗಳು AI ರಚಿತ.", en: "Pictures are AI-generated." } },
  contentNote: { kn: "ಯುದ್ಧ ಮತ್ತು ಸಾವು ನೇರವಾಗಿ ಹೇಳಲಾಗಿದೆ.", en: "Battles and deaths are told plainly." },
});
const series = () => [{ slug: SERIES, title: { kn: "ಕದಂಬರು", en: "Kadambas" }, description: { kn: "ಮೊದಲ ರಾಜವಂಶ.", en: "The first dynasty." }, years: [345, 540] }];

describe("history story contract", () => {
  it("accepts a complete story", () => expect(validateHistoryStory(story(), { series: SERIES, slug: SLUG })).toEqual([]));
  it("fails on an unknown fact id", () => {
    const s = story();
    s.scenes[0]!.facts = ["f-nowhere"];
    s.didYouKnow = ["f-kanchi", "f-missing"];
    const errors = validateHistoryStory(s);
    expect(errors).toContain("scene 1: unknown fact id f-nowhere");
    expect(errors).toContain("didYouKnow: unknown fact id f-missing");
  });
  it("fails on a scene with no facts", () => {
    const s = story();
    s.scenes[1]!.facts = [];
    expect(validateHistoryStory(s)).toContain("scene 2: facts list must not be empty");
  });
  it("fails on an em dash in Kannada or English prose", () => {
    const s = story();
    s.scenes[0]!.paragraphs[0] += " ಕಂಚಿ—ಬನವಾಸಿ";
    expect(validateHistoryStory(s)).toContain("story prose contains forbidden dash or markup");
    const e = story();
    e.facts[0]!.text.en = "Kanchi—Banavasi";
    expect(validateHistoryStory(e)).toContain("English text contains forbidden dash");
  });
  it("refuses a restricted licence, a 16+ only age list and a wrong folder", () => {
    expect(validateHistoryStory({ ...story(), provenance: { ...story().provenance, license: "CC-BY-NC-4.0" } })).toContain("licence not allowed");
    expect(validateHistoryStory({ ...story(), age: "8+" })).toContain("age must be one of 12+, 16+; Kannada language required");
    expect(validateHistoryStory(story(), { series: "ganga", slug: SLUG })).toContain("folder identity mismatch");
  });
  it("checks the series list shape", () => {
    expect(validateHistorySeries(series()[0])).toEqual([]);
    expect(validateHistorySeries({ ...series()[0], years: [540, 345] })).toEqual(["kadamba: years must be [start, end] with start before end"]);
    expect(validateHistorySeries({ slug: "x" })).toEqual(["invalid history series"]);
  });
});

describe("history pictures", () => {
  it("reads the synthetic WebP and enforces 16:9, width and size", () => {
    expect(storyboardDimensions(fakeWebp(1280, 720))).toEqual({ width: 1280, height: 720 });
    expect(validateHistoryImage(fakeWebp(1280, 720))).toBeUndefined();
    expect(validateHistoryImage(fakeWebp(1280, 728))).toBeUndefined();
    expect(validateHistoryImage(fakeWebp(1280, 1280))).toBe("must be 16:9");
    expect(validateHistoryImage(fakeWebp(1024, 576))).toBe("must be at least 1280px wide");
    expect(validateHistoryImage(fakeWebp(1920, 1080, 210_000))).toBe("exceeds 200 KB budget");
    expect(validateHistoryImage(Buffer.from("not an image"))).toBe("not a WebP");
  });
});

describe("history corpus gate", () => {
  let project: string;
  const write = (s: unknown, images: Record<string, Buffer>, review?: (bytes: string, digest: string) => unknown) => {
    const text = JSON.stringify(s, null, 2);
    const storyDir = join(project, "data/history-src", SERIES, SLUG);
    const imageDir = join(project, "public", dir);
    mkdirSync(storyDir, { recursive: true });
    rmSync(imageDir, { recursive: true, force: true });
    mkdirSync(imageDir, { recursive: true });
    writeFileSync(join(project, "data/history-src/collections.json"), JSON.stringify(series()));
    writeFileSync(join(storyDir, "story.json"), text);
    for (const [name, bytes] of Object.entries(images)) writeFileSync(join(imageDir, name), bytes);
    const digest = historyImageDigest(Object.values(images));
    const record = review ? review(text, digest) : {
      status: "approved", reviewer: "test reviewer", date: "2026-10-10", storySha256: sha256(text), imageSha256: digest,
      text: ["read every scene against the facts"], illustrations: ["inspected every picture"], limitations: ["fixture"],
    };
    writeFileSync(join(storyDir, "review.json"), JSON.stringify(record));
  };
  const images = () => ({ "cover.webp": fakeWebp(1280, 720, 10), "scene-01.webp": fakeWebp(1600, 900, 20), "scene-02.webp": fakeWebp(1920, 1080, 30) });

  beforeEach(() => {
    mkdirSync(join(process.cwd(), "tmp"), { recursive: true });
    project = mkdtempSync(join(process.cwd(), "tmp", "history-fixture-"));
  });
  afterEach(() => rmSync(project, { recursive: true, force: true }));

  it("passes on a valid fixture and tolerates a series without stories", () => {
    write(story(), images());
    mkdirSync(join(project, "data/history-src/ganga/wip"), { recursive: true });
    writeFileSync(join(project, "data/history-src/collections.json"), JSON.stringify([...series(), { ...series()[0], slug: "ganga" }]));
    expect(validateHistory(project)).toEqual([]);
  });
  it("fails on a wrong ratio, a missing picture and an oversize file", () => {
    write(story(), { ...images(), "scene-02.webp": fakeWebp(1280, 1280) });
    expect(validateHistory(project)).toContain(`${SERIES}/${SLUG}: ${dir}scene-02.webp must be 16:9`);
    write(story(), { "cover.webp": fakeWebp(1280, 720), "scene-01.webp": fakeWebp(1280, 720, 250_000) });
    const errors = validateHistory(project);
    expect(errors).toContain(`${SERIES}/${SLUG}: picture missing ${dir}scene-02.webp`);
    expect(errors).toContain(`${SERIES}/${SLUG}: ${dir}scene-01.webp exceeds 200 KB budget`);
  });
  it("fails when the review hashes no longer match the text or pictures", () => {
    write(story(), images(), (bytes, digest) => ({
      status: "approved", reviewer: "r", date: "2026-10-10", storySha256: sha256(`${bytes} `), imageSha256: digest,
      text: ["x"], illustrations: ["x"], limitations: ["x"],
    }));
    expect(validateHistory(project)).toContain(`${SERIES}/${SLUG}: story changed since review`);
    write(story(), images(), (bytes) => ({
      status: "approved", reviewer: "r", date: "2026-10-10", storySha256: sha256(bytes), imageSha256: sha256("stale"),
      text: ["x"], illustrations: ["x"], limitations: ["x"],
    }));
    expect(validateHistory(project)).toContain(`${SERIES}/${SLUG}: illustration changed since review`);
  });
  it("reports unknown fact ids, empty facts and em dashes through the corpus gate", () => {
    const s = story();
    s.scenes[0]!.facts = ["nope"];
    s.scenes[1]!.facts = [];
    s.summary[0] += "—";
    write(s, images());
    const errors = validateHistory(project);
    expect(errors).toContain(`${SERIES}/${SLUG}: scene 1: unknown fact id nope`);
    expect(errors).toContain(`${SERIES}/${SLUG}: scene 2: facts list must not be empty`);
    expect(errors).toContain(`${SERIES}/${SLUG}: story prose contains forbidden dash or markup`);
  });
});
