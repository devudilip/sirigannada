"use client";

import { useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { OFFLINE_CATEGORIES } from "../lib/categories";
import { expectedUrlsFor } from "../lib/expectedUrls";
import { clearCategoryCache } from "../lib/status";
import { useOfflineSummary } from "../lib/useOfflineSummary";
import { warmCategory } from "../lib/warmCategory";
import type { OfflineCategoryId, OfflineWarmProgress } from "../types";
import { OfflineCategoryRow } from "./OfflineCategoryRow";
import { OfflineClearAll } from "./OfflineClearAll";
import { OfflineSummaryBar } from "./OfflineSummaryBar";

type ProgressMap = Partial<Record<OfflineCategoryId, OfflineWarmProgress>>;

export function OfflineManager() {
  const t = useT();
  const booksManifest = useBooksManifest();
  // Fresh from the Cache API on every mount — nothing here is read from localStorage.
  const { statuses, summary, refresh } = useOfflineSummary();
  const [busyIds, setBusyIds] = useState<Set<OfflineCategoryId>>(new Set());
  const [progress, setProgress] = useState<ProgressMap>({});

  async function handleWarm(id: OfflineCategoryId) {
    setBusyIds((prev) => new Set(prev).add(id));
    setProgress((prev) => ({ ...prev, [id]: { done: 0, total: 1, failedUrls: [] } }));
    try {
      const result = await warmCategory(id, booksManifest, (p) => setProgress((prev) => ({ ...prev, [id]: p })));
      setProgress((prev) => ({ ...prev, [id]: result }));
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await refresh(id);
    }
  }

  async function handleClear(id: OfflineCategoryId) {
    const urls = await expectedUrlsFor(id, booksManifest);
    await clearCategoryCache(id, urls);
    setProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await refresh(id);
  }

  async function handleClearAll() {
    for (const meta of OFFLINE_CATEGORIES) await handleClear(meta.id);
  }

  const anyBusy = busyIds.size > 0;
  const nothingStored = summary.complete && summary.bytes === 0 && summary.cachedCount === 0;

  return (
    <div className="flex flex-col gap-6">
      <p className="sr-only" aria-live="polite">{t("offlineManagerTitle")}</p>
      <OfflineSummaryBar statuses={statuses} summary={summary} />
      <ul>
        {OFFLINE_CATEGORIES.map((meta) => (
          <li key={meta.id}>
            <OfflineCategoryRow
              meta={meta}
              status={statuses[meta.id] ?? null}
              busy={busyIds.has(meta.id)}
              progress={progress[meta.id] ?? null}
              onWarm={() => void handleWarm(meta.id)}
              onClear={() => void handleClear(meta.id)}
            />
          </li>
        ))}
      </ul>
      <OfflineClearAll disabled={anyBusy || !summary.complete || nothingStored} onClearAll={() => void handleClearAll()} />
    </div>
  );
}
