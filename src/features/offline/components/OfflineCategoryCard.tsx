"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import { formatBytes } from "../lib/formatSize";
import type { OfflineCategoryMeta } from "../lib/categories";
import type { OfflineCategoryStatus, OfflineWarmProgress } from "../types";

export function OfflineCategoryCard({
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
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink" lang="kn">{title}</h2>
          <p className="text-sm text-secondary">{statusLabel}</p>
        </div>
      </div>

      {status && !status.unavailable && (
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary">
          <span>{t("offlineFilesOf", { done: status.cachedCount, total: status.totalCount })}</span>
          <span>{t("offlineSizeLabel")}: {formatBytes(status.bytes)}</span>
        </p>
      )}

      {busy && progress && (
        <p className="mt-2 text-sm text-secondary" aria-live="polite">
          {t("offlineWorking", { done: progress.done, total: progress.total })}
        </p>
      )}
      {!busy && progress && progress.failedUrls.length > 0 && (
        <p className="mt-2 text-sm text-secondary" aria-live="polite">
          {t("offlineFailedCount", { count: progress.failedUrls.length })}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" disabled={busy || !status} onClick={onWarm}>
          {actionLabel}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={busy || !status || empty}
          onClick={() => setConfirmClear(true)}
        >
          {t("offlineClear")}
        </Button>
      </div>

      {confirmClear && (
        <div className="mt-3 rounded-md border border-line bg-paper p-3">
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
    </Card>
  );
}
