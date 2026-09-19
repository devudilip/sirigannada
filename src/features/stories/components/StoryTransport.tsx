"use client";

import { MoonIcon, PauseIcon, PlayIcon, SkipBack15Icon, SkipForward15Icon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { PLAYBACK_RATES, SKIP_SECONDS, type PlaybackRate, type SleepTimer } from "../types";
import { nextSleepTimer } from "../lib/sleep";

const outline =
  "inline-flex items-center justify-center rounded-md bg-elevated text-ink border border-line-strong hover:border-ink active:bg-paper-edge transition-colors duration-150";

function nextRate(rate: PlaybackRate): PlaybackRate {
  const i = PLAYBACK_RATES.indexOf(rate);
  return PLAYBACK_RATES[(i + 1) % PLAYBACK_RATES.length] ?? 1;
}

/** Speed · back 15 · play/pause (84 px coral) · forward 15 · sleep. Sized for small hands. */
export function StoryTransport({
  playing,
  buffering,
  error,
  rate,
  sleep,
  onToggle,
  onSkip,
  onRate,
  onSleep,
  onRetry,
}: {
  playing: boolean;
  buffering: boolean;
  error: boolean;
  rate: PlaybackRate;
  sleep: SleepTimer;
  onToggle: () => void;
  onSkip: (delta: number) => void;
  onRate: (rate: PlaybackRate) => void;
  onSleep: (timer: SleepTimer) => void;
  onRetry: () => void;
}) {
  const t = useT();
  const sleepLabel = sleep === "off" ? null : sleep === "end" ? t("playerSleepEnd") : t("playerSleepMinutes", { n: sleep });

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onRate(nextRate(rate))}
          aria-label={`${t("playerSpeed")} ${rate}×`}
          className={`${outline} size-12 text-sm font-semibold tabular-nums`}
        >
          {rate}×
        </button>
        <button type="button" onClick={() => onSkip(-SKIP_SECONDS)} aria-label={t("playerBack15")} className="inline-flex items-center justify-center size-14 rounded-md text-ink hover:bg-elevated active:bg-paper-edge">
          <SkipBack15Icon size={32} />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? t("playerPause") : t("playerPlay")}
          className="inline-flex items-center justify-center size-21 rounded-lg bg-accent text-on-accent hover:bg-accent-strong active:bg-accent-strong transition-colors duration-150"
        >
          {playing ? <PauseIcon size={40} /> : <PlayIcon size={40} />}
        </button>
        <button type="button" onClick={() => onSkip(SKIP_SECONDS)} aria-label={t("playerForward15")} className="inline-flex items-center justify-center size-14 rounded-md text-ink hover:bg-elevated active:bg-paper-edge">
          <SkipForward15Icon size={32} />
        </button>
        <div className="flex flex-col items-center gap-1 w-12">
          <button
            type="button"
            onClick={() => onSleep(nextSleepTimer(sleep))}
            aria-label={sleepLabel ?? t("playerSleep")}
            aria-pressed={sleep !== "off"}
            className={`${outline} size-12 ${sleep !== "off" ? "border-ink text-accent-strong" : ""}`}
          >
            <MoonIcon size={22} />
          </button>
        </div>
      </div>
      {sleepLabel ? (
        <p className="mt-2 text-right text-xs text-secondary" aria-hidden="true">
          {sleepLabel}
        </p>
      ) : null}
      {buffering && !error ? (
        <p className="mt-2 text-center text-sm text-muted" role="status">
          {t("playerBuffering")}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-center text-sm text-accent-strong" role="alert">
          {t("playerError")}{" "}
          <button type="button" onClick={onRetry} className="underline font-semibold min-h-11 px-2">
            {t("playerPlay")}
          </button>
        </p>
      ) : null}
    </div>
  );
}
