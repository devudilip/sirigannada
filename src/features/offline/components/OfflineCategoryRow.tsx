"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import { formatBytes } from "../lib/formatSize";
import type { OfflineCategoryMeta } from "../lib/categories";
import type { OfflineCategoryStatus, OfflineWarmProgress } from "../types";

/**
 * One category of the offline manager as a rule-separated row: title, status line, progress
 * while busy, then Update/Retry (outline) and Clear (coral text, confirmed inline).
 */
export function OfflineCategoryRow({
  meta,
  status,
  busy,
  progress,
  onWarm,
  onClear,
}: {
  meta: OfflineCategoryMeta;
  status: OfflineCategoryStatus | null;
  busy: boolean;
  progress: OfflineWarmProgress | null;
  onWarm: () => void;
  onClear: () => void;
}) {
  const t = useT();
  const [confirmClear, setConfirmClear] = useState(false);
  const title = t(meta.titleKey);

  const ready = status ? status.cachedCount === status.totalCount && status.totalCount > 0 : false;
  // Shell bytes include runtime assets, so it can contain removable data even if no required
  // route finished caching.
  const empty = status ? status.cachedCount === 0 && status.bytes === 0 : false;
  const statusLabel = !status
    ? t("loading")
    : status.unavailable
      ? t("offlineStatusUnavailable")
      : ready
        ? t("offlineStatusReady")
        : empty
          ? t("offlineStatusEmpty")
          : t("offlineStatusPartial");

  const actionLabel = ready ? t("offlineUpdate") : status && !empty ? t("offlineRetry") : t("offlineUpdate");

  return (
    <div className="rule-section flex flex-col gap-1 py-4">
      <h2 className="text-base font-semibold text-ink" lang="kn">{title}</h2>
      <p className="text-sm text-secondary">
        {status && !status.unavailable
          ? `${t("offlineFilesOf", { done: status.cachedCount, total: status.totalCount })} · ${formatBytes(status.bytes)} · ${statusLabel}`
          : statusLabel}
      </p>

      {busy && progress && (
        <p className="text-sm text-secondary" aria-live="polite">
          {t("offlineWorking", { done: progress.done, total: progress.total })}
        </p>
      )}
      {!busy && progress && progress.failedUrls.length > 0 && (
        <p className="text-sm text-secondary" aria-live="polite">
          {t("offlineFailedCount", { count: progress.failedUrls.length })}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" disabled={busy || !status} onClick={onWarm}>
          {actionLabel}
        </Button>
        <Button variant="ghost" size="sm" disabled={busy || !status || empty} onClick={() => setConfirmClear(true)}>
          {t("offlineClear")}
        </Button>
      </div>

      {confirmClear && (
        <div className="mt-3 border border-line p-3">
          <p className="text-sm text-ink">{t("offlineClearConfirm", { category: title })}</p>
          <div className="mt-2 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setConfirmClear(false);
                onClear();
              }}
            >
              {t("offlineClearConfirmAction")}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirmClear(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
