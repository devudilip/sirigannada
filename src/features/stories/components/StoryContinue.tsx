"use client";

import { useRouter } from "next/navigation";
import { PlayIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Story } from "@/lib/types";
import { storyCollection, storyTitle } from "../lib/display";
import { usePlayer } from "../lib/PlayerContext";
import type { StoryPosition } from "../lib/positions";
import { formatClock } from "../lib/time";
import { StoryArt } from "./StoryArt";

/**
 * "ಮುಂದುವರಿಸಿ · CONTINUE": the most recently paused story as an elevated card with 120 px art,
 * serif title, "4:12 left of 9:40 · collection", and one big coral Listen button that resumes it
 * and opens the player page.
 */
export function StoryContinue({ story, position, list }: { story: Story; position: StoryPosition; list: Story[] }) {
  const { locale, t } = useApp();
  const router = useRouter();
  const { play } = usePlayer();
  const total = position.durationSec > 0 ? position.durationSec : story.durationSec;
  const left = Math.max(0, total - position.positionSec);

  const onListen = () => {
    play(story, list);
    router.push(`/stories/${story.slug}`);
  };

  return (
    <section aria-labelledby="stories-continue">
      <SectionHeading k="storiesContinue" />
      <Card className="grid grid-cols-[120px_1fr] items-start gap-5 p-4">
        <StoryArt story={story} size="lg" />
        <div className="min-w-0 flex flex-col gap-3">
          <h3 id="stories-continue" className="font-serif font-semibold text-[21px] leading-snug text-ink" lang={locale}>
            {storyTitle(story, locale)}
          </h3>
          <p className="text-sm text-muted">
            <span lang={locale}>{t("storiesLeftOf", { left: formatClock(left), total: formatClock(total) })}</span>
            <span aria-hidden="true"> · </span>
            <span lang={locale}>{storyCollection(story, locale)}</span>
          </p>
          <Button size="lg" onClick={onListen} className="h-13 px-6 text-lg self-start">
            <PlayIcon size={22} />
            <span lang="kn">{t("storiesListen")}</span>
          </Button>
        </div>
      </Card>
    </section>
  );
}
