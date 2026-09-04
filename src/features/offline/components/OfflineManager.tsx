"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { OFFLINE_CATEGORIES } from "../lib/categories";
import { expectedUrlsFor } from "../lib/expectedUrls";
import { clearCategoryCache, loadCategoryStatus } from "../lib/status";
import { warmCategory } from "../lib/warmCategory";
import type { OfflineCategoryId, OfflineCategoryStatus, OfflineWarmProgress } from "../types";
import { OfflineCategoryCard } from "./OfflineCategoryCard";

type StatusMap = Partial<Record<OfflineCategoryId, OfflineCategoryStatus>>;
type ProgressMap = Partial<Record<OfflineCategoryId, OfflineWarmProgress>>;

export function OfflineManager() {
  const t = useT();
  const booksManifest = useBooksManifest();
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [busyIds, setBusyIds] = useState<Set<OfflineCategoryId>>(new Set());
  const [progress, setProgress] = useState<ProgressMap>({});

  const refresh = useCallback(
    async (id: OfflineCategoryId) => {
      const urls = await expectedUrlsFor(id, booksManifest);
      const status = await loadCategoryStatus(id, urls);
      setStatuses((prev) => ({ ...prev, [id]: status }));
    },
    [booksManifest],
  );

  useEffect(() => {
    // Fresh from the Cache API on every mount — nothing here is read from localStorage.
    for (const category of OFFLINE_CATEGORIES) void refresh(category.id);
  }, [refresh]);

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

  return (
    <div>
      <p className="sr-only" aria-live="polite">{t("offlineManagerTitle")}</p>
      <ul className="flex flex-col gap-3">
        {OFFLINE_CATEGORIES.map((meta) => (
          <li key={meta.id}>
            <OfflineCategoryCard
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
    </div>
  );
}
