import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { HistorySeries, HistoryStory } from "../types";

export { HISTORY_URL, historySeriesUrl, historyStoryUrl } from "./urls";

const root = join(process.cwd(), "data/history-src");

/** Build-time only: every series in display order, whether or not it has a story yet. */
export function readHistorySeries(): HistorySeries[] {
  return JSON.parse(readFileSync(join(root, "collections.json"), "utf8"));
}

export function readHistorySeriesBySlug(slug: string): HistorySeries | undefined {
  return readHistorySeries().find((s) => s.slug === slug);
}

/**
 * The published stories of one series, by `order` then slug. A series folder may be missing or
 * hold work in progress (a facts sheet without a story.json yet); both read as zero stories.
 */
export function readHistoryStories(series: string): HistoryStory[] {
  const dir = join(root, series);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, "story.json")))
    .map((entry): HistoryStory => JSON.parse(readFileSync(join(dir, entry.name, "story.json"), "utf8")))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function readHistoryStory(series: string, slug: string): HistoryStory | undefined {
  return readHistoryStories(series).find((s) => s.slug === slug);
}

/** Every published story across all series, in series then story order. */
export function readAllHistoryStories(): HistoryStory[] {
  return readHistorySeries().flatMap((series) => readHistoryStories(series.slug));
}
