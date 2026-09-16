"use client";

import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, SkipPrevIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";

/**
 * Always-visible page indicator ("೩ / ೧೫") on a 4 px gold progress bar, plus 56 px prev/next
 * corner buttons on phones — big enough for a child's thumb; hidden on md+ where ← → work.
 * For a narrated book the play/pause sits here too, in the middle, never hidden with the chrome:
 * it is the one control a child reaches for.
 */
export function BookReaderBottomBar({
  page,
  total,
  onPrev,
  onNext,
  hasAudio = false,
  playing = false,
  onTogglePlay,
  canRestart = false,
  onRestart,
}: {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  hasAudio?: boolean;
  playing?: boolean;
  onTogglePlay?: () => void;
  /** True once narration has moved past the start, so "hear from the start" has something to do. */
  canRestart?: boolean;
  onRestart?: () => void;
}) {
  const { locale, t } = useApp();
  const percent = total > 1 ? (page / (total - 1)) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 safe-bottom bg-surface/95 backdrop-blur">
      <span aria-hidden="true" className="block h-1 w-full bg-paper-edge">
        <span className="block h-full bg-gold transition-[width] duration-200" style={{ width: `${percent}%` }} />
      </span>
      <div className="flex items-center justify-between px-3 py-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 0}
          aria-label={t("prevPage")}
          className="md:hidden inline-flex size-14 items-center justify-center rounded-full bg-elevated border border-line-strong shadow-elevated text-ink disabled:opacity-30"
        >
          <ChevronLeftIcon size={26} />
        </button>
        <span className="flex flex-1 flex-col items-center gap-1">
          {hasAudio && onTogglePlay && (
            <span className="flex items-center gap-2">
              {canRestart && onRestart && (
                <button
                  type="button"
                  onClick={onRestart}
                  aria-label={t("picturebooksRestartAudio")}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-elevated text-ink shadow-elevated hover:border-ink active:bg-paper-edge"
                >
                  <SkipPrevIcon size={20} />
                </button>
              )}
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={playing ? t("playerPause") : t("playerPlay")}
                aria-pressed={playing}
                className="inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-accent bg-accent-lit px-5 text-on-accent shadow-lift hover:bg-accent-strong active:bg-accent-strong"
              >
                {playing ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
                <span className="text-base font-semibold" lang="kn">{playing ? t("playerPause") : t("storiesListen")}</span>
              </button>
            </span>
          )}
          <span aria-live="polite" className="text-sm font-semibold tabular-nums text-ink" lang={locale}>
            {t("playerOf", { n: localiseDigits(page + 1, locale), total: localiseDigits(total, locale) })}
          </span>
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page === total - 1}
          aria-label={t("nextPage")}
          className="md:hidden inline-flex size-14 items-center justify-center rounded-full bg-elevated border border-line-strong shadow-elevated text-ink disabled:opacity-30"
        >
          <ChevronRightIcon size={26} />
        </button>
      </div>
    </div>
  );
}
