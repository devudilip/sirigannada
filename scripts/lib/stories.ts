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

export function loadStory(dir: string, slug: string): Story {
  const raw = JSON.parse(readFileSync(join(dir, "story.json"), "utf8")) as Story;
  const textFile = join(dir, "text.txt");
  const timingsFile = join(dir, "timings.json");
  const sentences = existsSync(textFile) ? splitSentences(readFileSync(textFile, "utf8")) : undefined;
  const timings = existsSync(timingsFile) ? (JSON.parse(readFileSync(timingsFile, "utf8")) as number[]) : undefined;
  return { ...raw, slug, ...(sentences ? { sentences } : {}), ...(timings ? { timings } : {}) };
}

export interface ValidateOptions {
  /**
   * Local evaluation only (`_dev/`, git-ignored): a pending-permission story may carry audio so the
   * player can be tested against a real recording. Never true for committed sources.
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
