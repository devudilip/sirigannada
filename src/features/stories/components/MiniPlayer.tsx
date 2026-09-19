"use client";

import Link from "next/link";
import { CloseIcon, PauseIcon, PlayIcon, SkipNextIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { usePlayer } from "../lib/PlayerContext";
import { nextStory } from "../lib/queue";
import { firstAkshara, percentOf, remaining } from "../lib/scrubber";
import { formatClock } from "../lib/time";

const control = "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-surface active:bg-paper-edge";

/**
 * 56 px "now playing" bar above the bottom nav (bottom of the viewport on md+). Renders only
 * while a story is loaded; the AppShell hides it on that story's own player page.
 */
export function MiniPlayer() {
  const t = useT();
  const { locale } = useApp();
  const p = usePlayer();
  if (!p.story) return null;
  const story = p.story;
  const title = locale === "en" && story.titleEn ? story.titleEn : story.title;
  const hasNext = nextStory(p.queue, story) !== null;

  return (
    <div
      role="region"
      aria-label={t("miniPlayerLabel")}
      className="fixed inset-x-0 above-nav md:bottom-0 z-[41] bg-elevated border-t-2 border-line-strong md:safe-bottom"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 pl-3 pr-1">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface border border-line">
          {story.art ? (
            <img src={story.art} alt="" className="size-full object-cover" />
          ) : (
            <span className="font-serif font-bold text-lg leading-none text-accent-strong" lang="kn">
              {firstAkshara(story.title)}
            </span>
          )}
        </span>
        <Link href={`/stories/${story.slug}`} aria-label={`${t("miniPlayerOpen")}: ${title}`} className="min-w-0 flex-1 flex min-h-11 items-center gap-2 rounded-md px-1 hover:bg-surface">
          <span className="truncate font-serif text-sm font-semibold text-ink" lang={locale}>
            {title}
          </span>
          <span className="shrink-0 text-xs text-muted tabular-nums">{formatClock(remaining(p.position, p.duration))}</span>
        </Link>
        <button type="button" onClick={p.toggle} aria-label={p.playing ? t("playerPause") : t("playerPlay")} className={control}>
          {p.playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
        </button>
        <button type="button" onClick={p.next} disabled={!hasNext} aria-label={t("playerNext")} className={`${control} disabled:opacity-40`}>
          <SkipNextIcon size={24} />
        </button>
        <button type="button" onClick={p.stop} aria-label={t("miniPlayerClose")} className={control}>
          <CloseIcon size={22} />
        </button>
      </div>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-paper-edge">
        <span className="block h-full bg-gold" style={{ width: `${percentOf(p.position, p.duration)}%` }} />
      </span>
    </div>
  );
}
