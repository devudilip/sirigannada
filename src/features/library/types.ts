import type { BookForm } from "@/lib/types";

export interface OfflineWarmProgress {
  done: number;
  total: number;
  failedUrls: string[];
}

export type BookFormFilter = BookForm | "all";
