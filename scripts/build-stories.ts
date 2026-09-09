/**
 * Build public/data/stories/manifest.json from data/stories-src/. Includes the git-ignored
 * `_dev/` placeholders when that folder exists locally (never in CI). Refuses to write on errors.
 * Usage: npm run data:stories
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { StoriesManifest } from "../src/lib/types";
import { listStoryDirs, loadPending, loadStory, validateStory } from "./lib/stories";

export const STORIES_SRC = join(process.cwd(), "data", "stories-src");
const PUBLIC = join(process.cwd(), "public");
const OUT = join(PUBLIC, "data", "stories", "manifest.json");

export function buildStoriesManifest(root: string = STORIES_SRC, includeDev = existsSync(join(root, "_dev"))): { manifest: StoriesManifest; errors: string[] } {
  const dirs = listStoryDirs(root).map((slug) => ({ slug, dir: join(root, slug), dev: false }));
  if (includeDev) for (const slug of listStoryDirs(join(root, "_dev"))) dirs.push({ slug, dir: join(root, "_dev", slug), dev: true });
  const loaded = dirs.map(({ slug, dir, dev }) => ({ story: loadStory(dir, slug), dev }));
  const stories = loaded.map((l) => l.story);
  const errors = loaded.flatMap(({ story, dev }) => validateStory(story, PUBLIC, { allowPendingAudio: dev }));
  const seen = new Set<string>();
  for (const s of stories) {
    if (seen.has(s.slug)) errors.push(`stories/${s.slug}: duplicate slug`);
    seen.add(s.slug);
  }
  return { manifest: { stories, pending: loadPending(root), builtAt: new Date().toISOString() }, errors };
}

function main(): void {
  const { manifest, errors } = buildStoriesManifest();
  if (errors.length > 0) {
    console.error(`✗ refusing to build stories: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  mkdirSync(join(PUBLIC, "data", "stories"), { recursive: true });
  writeFileSync(OUT, JSON.stringify(manifest));
  const pending = manifest.pending.reduce((n, p) => n + p.titles.length, 0);
  console.log(`✓ ${manifest.stories.length} story(ies), ${pending} pending title(s) → ${OUT}`);
}

if (process.argv[1]?.endsWith("build-stories.ts")) main();
