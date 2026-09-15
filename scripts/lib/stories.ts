/**
 * Load and validate story sources under data/stories-src/. Each story is a folder with story.json
 * (a `Story` minus `sentences`/`timings`, which come from text.txt and timings.json beside it).
 * `_pending/*.json` lists catalogues we have asked permission for — titles only, nothing playable.
 * `_dev/` is git-ignored: synthetic clips for developing the player, never part of a release.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { License, PendingStorySource, Story, StoryTag } from "../../src/lib/types";

const LICENSES: readonly License[] = ["public-domain", "CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0", "ODbL-1.0"];
const TAGS: readonly StoryTag[] = ["animal", "moral", "funny", "school", "family"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function listStoryDirs(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .filter((name) => !name.startsWith("_") && statSync(join(root, name)).isDirectory())
    .sort();
}

/** Split a text file into sentences: one per line, or on Kannada/Latin sentence punctuation. */
export function splitSentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Where a story's audio lives once it may ship: public/data/stories/<slug>.mp3. */
export function audioUrlFor(slug: string): string {
  return `/data/stories/${slug}.mp3`;
}

/**
 * Load one story. `audio` in story.json is optional: when omitted, the loader attaches the
 * conventional file if it exists under `publicRoot`. That lets a pending-permission story be
 * committed without audio while a local, git-ignored copy of the recording still plays here.
 */
export function loadStory(dir: string, slug: string, publicRoot?: string): Story {
  const raw = JSON.parse(readFileSync(join(dir, "story.json"), "utf8")) as Story;
  const textFile = join(dir, "text.txt");
  const timingsFile = join(dir, "timings.json");
  const sentences = existsSync(textFile) ? splitSentences(readFileSync(textFile, "utf8")) : undefined;
  const timings = existsSync(timingsFile) ? (JSON.parse(readFileSync(timingsFile, "utf8")) as number[]) : undefined;
  let audio: string | null = raw.audio ?? null;
  if (audio === null && publicRoot && existsSync(join(publicRoot, audioUrlFor(slug)))) audio = audioUrlFor(slug);
  const audioFile = audio && publicRoot ? join(publicRoot, audio) : null;
  const audioBytes = audioFile && existsSync(audioFile) ? statSync(audioFile).size : undefined;
  return { ...raw, slug, audio, ...(audioBytes ? { audioBytes } : {}), art: raw.art ?? null, ...(sentences ? { sentences } : {}), ...(timings ? { timings } : {}) };
}

export interface ValidateOptions {
  /**
   * Local evaluation only: a pending-permission story may carry audio so the player can be tested
   * against a real recording that is git-ignored on this machine. Never true in CI or validation.
   */
  allowPendingAudio?: boolean;
}

export function validateStory(story: Story, publicRoot: string, options: ValidateOptions = {}): string[] {
  const e: string[] = [];
  const at = `stories/${story.slug}`;
  if (!SLUG.test(story.slug)) e.push(`${at}: slug must be lowercase kebab-case`);
  if (!story.title?.trim()) e.push(`${at}: title is required`);
  if (!story.collection?.kn || !story.collection?.en) e.push(`${at}: collection needs kn and en`);
  if (!Array.isArray(story.tags) || story.tags.some((t) => !TAGS.includes(t))) e.push(`${at}: tags must be from ${TAGS.join(", ")}`);
  if (!(story.durationSec > 0)) e.push(`${at}: durationSec must be positive`);
  const p = story.provenance;
  if (!p) return [...e, `${at}: provenance block is required`];
  if (!p.source || !p.licenseNote || !p.retrieved) e.push(`${at}: provenance needs source, licenseNote, retrieved`);
  if (p.license === "pending-permission") {
    if (!options.allowPendingAudio && (story.audio || story.art || story.sentences)) e.push(`${at}: a pending-permission story may not carry audio, art, or text`);
    if (story.audio && !existsSync(join(publicRoot, story.audio))) e.push(`${at}: audio file ${story.audio} is missing`);
  } else if (!LICENSES.includes(p.license)) {
    e.push(`${at}: license must be one of ${LICENSES.join(", ")} or pending-permission`);
  } else {
    if (!story.audio) e.push(`${at}: a licensed story needs an audio URL`);
    if (story.audio && !story.audio.startsWith("/data/stories/")) e.push(`${at}: audio must be same-origin under /data/stories/`);
    if (story.audio && !existsSync(join(publicRoot, story.audio))) e.push(`${at}: audio file ${story.audio} is missing`);
    if (story.art && !existsSync(join(publicRoot, story.art))) e.push(`${at}: art file ${story.art} is missing`);
    if (p.license === "public-domain" && !p.authorDied) e.push(`${at}: public-domain stories need authorDied`);
  }
  if (story.timings) {
    if (!story.sentences || story.timings.length !== story.sentences.length) e.push(`${at}: timings must match sentences one to one`);
    if (story.timings.some((t, i) => i > 0 && t < (story.timings?.[i - 1] ?? 0))) e.push(`${at}: timings must not decrease`);
  }
  return e;
}

/** Collection name, then series number, then title — the order the hub lists stories in. */
export function sortStories(stories: readonly Story[]): Story[] {
  return [...stories].sort(
    (a, b) => a.collection.kn.localeCompare(b.collection.kn, "kn") || (a.series ?? 1e9) - (b.series ?? 1e9) || a.title.localeCompare(b.title, "kn"),
  );
}

/** Stories without audio, grouped by collection, as "awaiting permission" titles for the hub. */
export function pendingFromStories(stories: readonly Story[]): PendingStorySource[] {
  const groups = new Map<string, PendingStorySource>();
  for (const s of sortStories(stories)) {
    const key = s.provenance.source;
    const group = groups.get(key) ?? { name: s.collection, source: key, titles: [] };
    group.titles.push({ title: s.title, ...(s.titleEn ? { titleEn: s.titleEn } : {}) });
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function loadPending(root: string): PendingStorySource[] {
  const dir = join(root, "_pending");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const doc = JSON.parse(readFileSync(join(dir, f), "utf8")) as PendingStorySource;
      return { name: doc.name, source: doc.source, titles: doc.titles };
    });
}
