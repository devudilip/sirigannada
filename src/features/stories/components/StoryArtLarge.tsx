import type { Story } from "@/lib/types";
import { firstAkshara } from "../lib/scrubber";

/**
 * The player's big square art: the story's illustration when it has one, otherwise the first
 * akshara of the title in the serif on an elevated card. Decorative — the title sits beneath it.
 */
export function StoryArtLarge({ story, className = "" }: { story: Story; className?: string }) {
  if (story.art) {
    return (
      <img src={story.art} alt="" className={`block w-full aspect-square object-cover rounded-lg bg-elevated border border-line ${className}`} />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`flex w-full aspect-square items-center justify-center rounded-lg bg-elevated border border-line ${className}`}
    >
      <span className="font-serif font-bold text-accent-strong leading-none text-[96px]" lang="kn">
        {firstAkshara(story.title)}
      </span>
    </div>
  );
}
