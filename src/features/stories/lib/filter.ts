import type { Story, StoryTag } from "@/lib/types";
import type { StoryFilter } from "../types";

export const SHORT_MAX_SEC = 5 * 60;
export const FILTERS: readonly StoryFilter[] = ["all", "short", "animal", "moral", "funny", "school", "family"];

export function filterStories(stories: readonly Story[], filter: StoryFilter): Story[] {
  if (filter === "all") return [...stories];
  if (filter === "short") return stories.filter((s) => s.durationSec < SHORT_MAX_SEC);
  return stories.filter((s) => s.tags.includes(filter as StoryTag));
}

/** Only the filters that would show at least one story, "all" always first. */
export function availableFilters(stories: readonly Story[]): StoryFilter[] {
  return FILTERS.filter((f) => f === "all" || filterStories(stories, f).length > 0);
}

export function totalDuration(stories: readonly Story[]): number {
  return stories.reduce((n, s) => n + s.durationSec, 0);
}
