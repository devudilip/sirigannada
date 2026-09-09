"use client";

import { PauseIcon, PlayIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { formatClock } from "../lib/time";
import type { PlaybackRate } from "../types";

const step = "inline-flex size-11 items-center justify-center rounded-md border border-line-strong bg-elevated font-semibold text-ink hover:border-ink active:bg-paper-edge disabled:opacity-40 disabled:pointer-events-none";

/**
 * Fixed bottom bar: −1 sentence, play/pause (52 px coral), +1 sentence, "sentence n of total ·
 * m:ss" over a 2 px gold progress line, and the speed cycle. Sits above the phone nav bar.
 */
export function ReadAlongTransport({
  playing,
  position,
  duration,
  sentence,
  total,
  canStep,
  rate,
  onPrev,
  onToggle,
  onNext,
  onRate,
}: {
  playing: boolean;
  position: number;
  duration: number;
  /** 1-based current sentence, 0 when none is lit. */
  sentence: number;
  total: number;
  canStep: boolean;
  rate: PlaybackRate;
  onPrev: () => void;
  onToggle: () => void;
  onNext: () => void;
  onRate: () => void;
}) {
  const t = useT();
  const pct = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 bg-elevated border-t-2 border-line-strong safe-bottom">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-5 py-2">
        <button type="button" onClick={onPrev} disabled={!canStep} aria-label={t("readAlongPrev")} className={step}>
          −1
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? t("playerPause") : t("playerPlay")}
          className="inline-flex size-13 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent hover:bg-accent-strong active:bg-accent-strong"
        >
          {playing ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
        </button>
        <button type="button" onClick={onNext} disabled={!canStep} aria-label={t("readAlongNext")} className={step}>
          +1
        </button>
        <div className="min-w-0 flex-1 px-1">
          <p className="truncate text-xs text-secondary">
            {t("readAlongSentence", { n: sentence > 0 ? sentence : "–", total })} · {formatClock(position)}
          </p>
          <div className="mt-1 h-0.5 w-full bg-paper-edge" role="presentation">
            <div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onRate}
          aria-label={`${t("playerSpeed")} ${rate}×`}
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-line-strong bg-elevated px-2 text-sm font-semibold text-ink hover:border-ink active:bg-paper-edge"
        >
          {rate}×
        </button>
      </div>
    </div>
  );
}
