import type { Story } from "@/lib/types";

export type SaveProgress = (done: number, total: number) => void;

/**
 * Save `stories` one after another (audio files are large; parallel fetches would starve each other
 * on a phone). `save` resolves true on success. Reports progress after each story and returns the
 * slugs that failed so the caller can offer a retry. Never throws: a rejected `save` counts as failed.
 */
export async function saveAll(
  stories: readonly Story[],
  save: (story: Story) => Promise<boolean>,
  onProgress: SaveProgress = () => {},
): Promise<string[]> {
  const failed: string[] = [];
  const total = stories.length;
  onProgress(0, total);
  let done = 0;
  for (const story of stories) {
    let ok = false;
    try {
      ok = await save(story);
    } catch {
      ok = false;
    }
    if (!ok) failed.push(story.slug);
    done += 1;
    onProgress(done, total);
  }
  return failed;
}
