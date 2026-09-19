import type { OfflineCategoryId, OfflineCategoryStatus } from "../types";

export type OfflineStatusMap = Partial<Record<OfflineCategoryId, OfflineCategoryStatus>>;

export interface OfflineSummary {
  /** Total bytes across every category that has reported. */
  bytes: number;
  cachedCount: number;
  totalCount: number;
  /** True once every category in `ids` has a status. */
  complete: boolean;
}

/** Sums the per-category Cache API figures into one line for the More row and the manager header. */
export function summarizeStatuses(statuses: OfflineStatusMap, ids: readonly OfflineCategoryId[]): OfflineSummary {
  let bytes = 0;
  let cachedCount = 0;
  let totalCount = 0;
  let reported = 0;
  for (const id of ids) {
    const status = statuses[id];
    if (!status) continue;
    reported += 1;
    bytes += status.bytes;
    cachedCount += status.cachedCount;
    totalCount += status.totalCount;
  }
  return { bytes, cachedCount, totalCount, complete: reported === ids.length };
}

/** Width of each category's share of the stacked bar, in percent, in the order given. Zero total → all zero. */
export function segmentPercents(statuses: OfflineStatusMap, ids: readonly OfflineCategoryId[]): number[] {
  const total = ids.reduce((sum, id) => sum + (statuses[id]?.bytes ?? 0), 0);
  if (total <= 0) return ids.map(() => 0);
  return ids.map((id) => ((statuses[id]?.bytes ?? 0) / total) * 100);
}
