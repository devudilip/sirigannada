"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckIcon, PauseIcon, PlayIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import type { Story } from "@/lib/types";
import { storyCollection, storyTitle } from "../lib/display";
import { useStoryCached } from "../lib/offline";
import { usePlayer } from "../lib/PlayerContext";
import { formatClock } from "../lib/time";
import { StoryArt } from "./StoryArt";

/**
 * One hub row on a 1 px rule: 72 px art, serif title, muted meta ("collection · m:ss · on device"),
 * and a 44 px outline play button. The row body opens the player page; the button plays in place.
 */
export function StoryRow({ story, list, cacheTick = 0 }: { story: Story; list: Story[]; cacheTick?: number }) {
  const { locale, t } = useApp();
  const router = useRouter();
  const player = usePlayer();
  const cached = useStoryCached(story, cacheTick);
  const title = storyTitle(story, locale);
  const isCurrent = player.story?.slug === story.slug;
  const showPause = isCurrent && player.playing;
  const href = `/stories/${story.slug}`;

  const onPlay = () => {
    if (isCurrent) player.toggle();
    else player.play(story, list);
  };

  return (
    <div
      className="rule-row grid grid-cols-[72px_1fr_auto] items-center gap-4 py-4 hover:bg-elevated active:bg-paper-edge cursor-pointer"
      onClick={() => router.push(href)}
    >
      <StoryArt story={story} size="md" />
      <span className="min-w-0">
        <Link
          href={href}
          className="block font-serif font-semibold text-[17px] leading-snug text-ink hover:underline"
          lang={locale}
          onClick={(e) => e.stopPropagation()}
        >
          {title}
        </Link>
        <span className="mt-1 flex flex-wrap items-center gap-x-1 text-[13px] text-muted">
          <span lang={locale}>{storyCollection(story, locale)}</span>
          <span aria-hidden="true">·</span>
          <span lang="en" className="font-latin">
            {formatClock(story.durationSec)}
          </span>
          {cached === null ? null : (
            <>
              <span aria-hidden="true">·</span>
              {cached ? (
                <span className="inline-flex items-center gap-1 text-ink">
                  <CheckIcon size={14} />
                  {t("storiesOnDevice")}
                </span>
              ) : (
                <span className="text-accent-strong">{t("storiesStreams")}</span>
              )}
            </>
          )}
        </span>
      </span>
      <button
        type="button"
        aria-label={showPause ? t("playerPause") : t("storiesPlayStory", { title })}
        aria-pressed={showPause}
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          isCurrent ? "border-accent text-accent-strong" : "border-ink text-ink"
        } hover:bg-paper-edge active:bg-paper-edge`}
      >
        {showPause ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      </button>
    </div>
  );
}
