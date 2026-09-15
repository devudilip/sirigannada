"use client";

import { PlayIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import type { Story } from "@/lib/types";
import { formatClock } from "../lib/time";

/** The play queue as a list of rule rows; tapping a row plays that story and closes the sheet. */
export function StoryQueueSheet({
  open,
  onClose,
  queue,
  current,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  queue: readonly Story[];
  current: Story | null;
  onPick: (story: Story) => void;
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <Sheet open={open} onClose={onClose} title={t("playerQueue")}>
      <ol className="rule-section">
        {queue.map((s, i) => {
          const active = s.slug === current?.slug;
          const title = locale === "en" && s.titleEn ? s.titleEn : s.title;
          return (
            <li key={s.slug} className="rule-row">
              <button
                type="button"
                onClick={() => {
                  onPick(s);
                  onClose();
                }}
                aria-current={active ? "true" : undefined}
                aria-label={t("storiesPlayStory", { title })}
                className={`grid w-full grid-cols-[28px_1fr_auto] items-center gap-3 py-3 min-h-14 text-left hover:bg-elevated active:bg-paper-edge ${active ? "text-accent-strong" : "text-ink"}`}
              >
                <span className="text-sm text-muted tabular-nums" aria-hidden="true">
                  {active ? <PlayIcon size={18} className="text-accent-strong" /> : i + 1}
                </span>
                <span className="font-serif font-semibold text-base leading-snug truncate" lang={locale}>
                  {title}
                </span>
                <span className="text-sm text-muted tabular-nums">{formatClock(s.durationSec)}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}
