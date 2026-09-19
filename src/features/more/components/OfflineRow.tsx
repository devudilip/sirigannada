"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { formatBytes } from "@/features/offline/lib/formatSize";
import { useOfflineSummary } from "@/features/offline/lib/useOfflineSummary";

/**
 * The ಆಫ್‌ಲೈನ್ row of the More list. Same layout as `DestinationLink` (rule-row, title, sub,
 * arrow) but the sub-line is live: "{size} on device" once the Cache API has been read.
 */
export function OfflineRow() {
  const t = useT();
  const { summary } = useOfflineSummary();
  const sub = summary.complete ? t("offlineOnDevice", { size: formatBytes(summary.bytes) }) : t("offlineManagerSub");
  return (
    <Link
      href="/tools/offline"
      className="group rule-row flex items-center justify-between gap-4 py-3 min-h-14 h-full transition-colors hover:bg-elevated active:bg-paper-edge"
    >
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-lg font-semibold text-ink leading-snug">{t("offlineManagerTitle")}</span>
        <span className="text-sm text-secondary line-clamp-2" aria-live="polite">{sub}</span>
      </span>
      <ArrowRightIcon size={20} className="shrink-0 text-ink" />
    </Link>
  );
}
