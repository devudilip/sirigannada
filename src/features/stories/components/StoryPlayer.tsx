"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, ListIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { IconButton } from "@/components/ui/Button";
import { licenseLabelKey } from "@/features/credits/lib/licenseLabel";
import type { Story } from "@/lib/types";
import { usePlayer } from "../lib/PlayerContext";
import { useStoriesManifest } from "../lib/manifest";
import { nextStory, playable, queueIndex } from "../lib/queue";
import { StoryActionsRow } from "./StoryActionsRow";
import { StoryArtLarge } from "./StoryArtLarge";
import { StoryPlayerFooter } from "./StoryPlayerFooter";
import { StoryQueueSheet } from "./StoryQueueSheet";
import { StoryScrubber } from "./StoryScrubber";
import { StoryTextPreview } from "./StoryTextPreview";
import { StoryTransport } from "./StoryTransport";

/**
 * Full-screen player for one story. Nothing autoplays on load (browsers block it): the page
 * shows the big play button and the first tap starts the story with the hub's playable queue.
 */
export function StoryPlayer({ slug }: { slug: string }) {
  const t = useT();
  const { locale } = useApp();
  const manifest = useStoriesManifest();
  const player = usePlayer();
  const [queueOpen, setQueueOpen] = useState(false);

  if (!manifest) return <div className="mx-auto max-w-2xl px-5 py-10 text-muted">{t("playerBuffering")}</div>;
  const story = manifest.stories.find((s) => s.slug === slug);
  if (!story || !story.audio || story.provenance.license === "pending-permission") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10">
        <p className="text-secondary">{t("storiesEmpty")}</p>
        <Link href="/stories" className="mt-4 inline-flex min-h-11 items-center font-semibold text-accent-strong underline">
          {t("storiesTitle")}
        </Link>
      </div>
    );
  }

  const queue = player.queue.length > 0 ? player.queue : playable(manifest.stories);
  const isCurrent = player.story?.slug === story.slug;
  const position = isCurrent ? player.position : 0;
  const duration = isCurrent ? player.duration || story.durationSec : story.durationSec;
  const start = () => player.play(story, queue);
  const toggle = () => (isCurrent ? player.toggle() : start());
  const seek = (sec: number) => (isCurrent ? player.seek(sec) : start());
  const skip = (d: number) => (isCurrent ? player.skip(d) : start());
  const pick = (s: Story) => player.play(s, queue);

  const title = locale === "en" && story.titleEn ? story.titleEn : story.title;
  const { publisher, narrator, license } = story.provenance;
  const meta = [
    publisher ?? story.collection[locale],
    publisher ? story.collection[locale] : null,
    narrator ? `${t("playerNarrator")} ${narrator}` : null,
    t(licenseLabelKey(license)),
  ].filter((m): m is string => Boolean(m));

  return (
    <div className="mx-auto w-full max-w-2xl md:max-w-5xl px-5 pb-8 safe-bottom">
      <header className="flex items-center justify-between py-2">
        <Link href="/stories" aria-label={t("playerCollapse")} className="inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-elevated active:bg-paper-edge">
          <ChevronDownIcon size={24} />
        </Link>
        <p className="kicker text-muted truncate">
          <span lang="kn">{t("storiesTitle")}</span> · {t("playerOf", { n: queueIndex(queue, story), total: queue.length })}
        </p>
        <IconButton onClick={() => setQueueOpen(true)} aria-label={t("playerQueue")} aria-haspopup="dialog">
          <ListIcon size={22} />
        </IconButton>
      </header>

      <div className="md:grid md:grid-cols-[420px_1fr] md:gap-10 md:items-start">
        <div>
          <StoryArtLarge story={story} className="mt-2" />
          <h1 className="mt-5 font-serif font-bold text-2xl leading-tight text-ink" lang={locale}>
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-snug text-muted">{meta.join(" · ")}</p>
          <StoryScrubber position={position} duration={duration} onSeek={seek} />
          <StoryTransport
            playing={isCurrent && player.playing}
            buffering={isCurrent && player.buffering}
            error={isCurrent && player.error}
            rate={player.rate}
            sleep={player.sleep}
            onToggle={toggle}
            onSkip={skip}
            onRate={player.setRate}
            onSleep={player.setSleep}
            onRetry={start}
          />
          <StoryActionsRow story={story} />
          <StoryPlayerFooter
            next={nextStory(queue, story)}
            stopAfter={isCurrent && player.stopAfter}
            autoplay={player.autoplay}
            onStopAfter={player.setStopAfter}
            onAutoplay={player.setAutoplay}
          />
        </div>
        <aside className="hidden md:block md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto md:pr-2 md:pt-2" aria-label={t("readAlongTitle")}>
          <StoryTextPreview story={story} position={position} onSeek={seek} />
        </aside>
      </div>

      <StoryQueueSheet open={queueOpen} onClose={() => setQueueOpen(false)} queue={queue} current={story} onPick={pick} />
    </div>
  );
}
