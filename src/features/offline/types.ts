export type OfflineCategoryId = "shell" | "dictionary" | "books" | "proverbs";

export interface OfflineWarmProgress {
  done: number;
  total: number;
  failedUrls: string[];
}

/** Freshly computed from the Cache API on every mount — never persisted. */
export interface OfflineCategoryStatus {
  id: OfflineCategoryId;
  cachedCount: number;
  totalCount: number;
  bytes: number;
  missingUrls: string[];
  /** True when the Cache API itself is unavailable in this browser. */
  unavailable: boolean;
}
