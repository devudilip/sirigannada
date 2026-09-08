"use client";

import { useT } from "@/components/providers/AppProviders";
import { OFFLINE_CATEGORIES } from "../lib/categories";
import { formatBytes } from "../lib/formatSize";
import { segmentPercents, type OfflineStatusMap, type OfflineSummary } from "../lib/summary";
import type { OfflineCategoryId } from "../types";

const IDS: readonly OfflineCategoryId[] = OFFLINE_CATEGORIES.map((c) => c.id);

/** Fill per category — shell ink, dictionary coral, books neutral-400, proverbs neutral-300. */
const SEGMENT_FILL: Record<OfflineCategoryId, string> = {
  shell: "bg-ink",
  dictionary: "bg-accent",
  books: "bg-neutral",
  proverbs: "bg-paper-edge",
};

/**
 * Header block of the offline manager: "{used} used · {n} of {m} files", a 10 px stacked bar
 * proportional to bytes per category, and a legend of 8 px squares.
 */
export function OfflineSummaryBar({ statuses, summary }: { statuses: OfflineStatusMap; summary: OfflineSummary }) {
  const t = useT();
  const percents = segmentPercents(statuses, IDS);

  return (
    <div className="flex flex-col gap-2">
      <p className="flex flex-wrap items-baseline gap-x-2 text-base">
        <span className="font-bold text-ink">
          {summary.complete ? t("offlineUsed", { size: formatBytes(summary.bytes) }) : t("loading")}
        </span>
        {summary.complete && (
          <span className="text-sm text-muted">· {t("offlineFilesOf", { done: summary.cachedCount, total: summary.totalCount })}</span>
        )}
      </p>
      <div
        role="img"
        aria-label={t("offlineStorageBreakdown")}
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-paper-edge"
      >
        {IDS.map((id, i) => {
          const pct = percents[i] ?? 0;
          if (pct <= 0) return null;
          return <span key={id} className={`h-full ${SEGMENT_FILL[id]}`} style={{ width: `${pct}%` }} />;
        })}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {OFFLINE_CATEGORIES.map((meta) => (
          <li key={meta.id} className="flex items-center gap-1.5 text-xs text-secondary">
            <span aria-hidden="true" className={`inline-block size-2 shrink-0 ${SEGMENT_FILL[meta.id]}`} />
            <span lang="kn">{t(meta.titleKey)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
