"use client";

import { useApp, useT } from "@/components/providers/AppProviders";
import type { Story } from "@/lib/types";

/** "Next · title · plays automatically" with the stop-after and autoplay toggles. */
export function StoryPlayerFooter({
  next,
  stopAfter,
  autoplay,
  onStopAfter,
  onAutoplay,
}: {
  next: Story | null;
  stopAfter: boolean;
  autoplay: boolean;
  onStopAfter: (on: boolean) => void;
  onAutoplay: (on: boolean) => void;
}) {
  const t = useT();
  const { locale } = useApp();
  const nextTitle = next ? (locale === "en" && next.titleEn ? next.titleEn : next.title) : null;
  const textButton = "min-h-11 px-2 -mr-2 text-sm font-semibold text-accent-strong hover:underline";

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-secondary">
      <p className="min-w-0 flex-1">
        {nextTitle ? (
          <>
            {t("playerNextUp")} ·{" "}
            <span className="font-serif font-semibold text-ink" lang={locale}>
              {nextTitle}
            </span>
            {stopAfter ? (
              <> · {t("playerWillStop")}</>
            ) : autoplay ? (
              <> · {t("playerAutoplays")}</>
            ) : null}
          </>
        ) : (
          t("playerLast")
        )}
      </p>
      <span className="flex items-center gap-1">
        {next ? (
          <button type="button" onClick={() => onStopAfter(!stopAfter)} aria-pressed={stopAfter} className={textButton}>
            {stopAfter ? t("playerKeepGoing") : t("playerStopAfter")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onAutoplay(!autoplay)}
          aria-pressed={autoplay}
          className={`min-h-11 px-2 text-sm font-semibold rounded-md ${autoplay ? "text-ink" : "text-muted line-through"}`}
        >
          {t("playerAutoplay")}
        </button>
      </span>
    </div>
  );
}
