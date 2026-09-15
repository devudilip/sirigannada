"use client";

import Link from "next/link";
import { ChevronLeftIcon, PauseIcon, PlayIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { TextSize } from "../lib/textSize";

/**
 * Thin top bar that hides after a beat of no interaction: back to the hub, the book's title,
 * the Aa control, and — for a narrated book — a play/pause for the whole-story audio.
 */
export function BookReaderTopBar({
  title,
  size,
  onCycleSize,
  visible,
  hasAudio,
  playing,
  onTogglePlay,
}: {
  title: string;
  size: TextSize;
  onCycleSize: () => void;
  visible: boolean;
  hasAudio: boolean;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  const t = useT();
  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 flex items-center gap-2 bg-surface/95 backdrop-blur border-b border-line px-2 py-2 transition-transform duration-200 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link href="/picturebooks" aria-label={t("picturebooksBack")} className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-elevated active:bg-paper-edge">
        <ChevronLeftIcon size={24} />
      </Link>
      <h1 lang="kn" className="min-w-0 flex-1 truncate font-serif text-sm font-semibold text-ink">
        {title}
      </h1>
      {hasAudio && (
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? t("playerPause") : t("playerPlay")}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-elevated active:bg-paper-edge"
        >
          {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>
      )}
      <button
        type="button"
        onClick={onCycleSize}
        aria-label={`${t("readAlongTextSize")} · ${size}`}
        className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-line-strong bg-elevated px-3 font-serif text-base font-semibold text-ink hover:border-ink active:bg-paper-edge"
      >
        Aa
      </button>
    </header>
  );
}
