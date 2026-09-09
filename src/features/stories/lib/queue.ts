import type { Story } from "@/lib/types";

/** The story after `current` in `queue`, or null at the end. */
export function nextStory(queue: readonly Story[], current: Story | null): Story | null {
  if (!current) return queue[0] ?? null;
  const i = queue.findIndex((s) => s.slug === current.slug);
  return i >= 0 && i + 1 < queue.length ? (queue[i + 1] ?? null) : null;
}

export function prevStory(queue: readonly Story[], current: Story | null): Story | null {
  if (!current) return null;
  const i = queue.findIndex((s) => s.slug === current.slug);
  return i > 0 ? (queue[i - 1] ?? null) : null;
}

/** 1-based position of `current` in `queue` for "7 of 24" labels; 0 when absent. */
export function queueIndex(queue: readonly Story[], current: Story | null): number {
  if (!current) return 0;
  return queue.findIndex((s) => s.slug === current.slug) + 1;
}

/** Stories that can actually play: licensed and carrying a same-origin audio URL. */
export function playable(stories: readonly Story[]): Story[] {
  return stories.filter((s) => s.audio !== null && s.provenance.license !== "pending-permission");
}
