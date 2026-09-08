"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { OFFLINE_CATEGORIES } from "./categories";
import { expectedUrlsFor } from "./expectedUrls";
import { loadCategoryStatus } from "./status";
import { summarizeStatuses, type OfflineStatusMap, type OfflineSummary } from "./summary";
import type { OfflineCategoryId } from "../types";

const IDS: readonly OfflineCategoryId[] = OFFLINE_CATEGORIES.map((c) => c.id);

/**
 * Live Cache API status for every offline category, read fresh on mount (nothing persisted).
 * `summary.complete` flips true once all four categories have reported; `refresh(id)` re-reads
 * one category after a warm or clear.
 */
export function useOfflineSummary(): {
  statuses: OfflineStatusMap;
  summary: OfflineSummary;
  refresh: (id: OfflineCategoryId) => Promise<void>;
} {
  const booksManifest = useBooksManifest();
  const [statuses, setStatuses] = useState<OfflineStatusMap>({});

  const refresh = useCallback(
    async (id: OfflineCategoryId) => {
      const urls = await expectedUrlsFor(id, booksManifest);
      const status = await loadCategoryStatus(id, urls);
      setStatuses((prev) => ({ ...prev, [id]: status }));
    },
    [booksManifest],
  );

  useEffect(() => {
    for (const id of IDS) void refresh(id);
  }, [refresh]);

  const summary = useMemo(() => summarizeStatuses(statuses, IDS), [statuses]);
  return { statuses, summary, refresh };
}
