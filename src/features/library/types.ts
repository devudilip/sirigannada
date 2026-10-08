import type { BookForm } from "@/lib/types";

export interface OfflineWarmProgress {
  done: number;
  total: number;
  failedUrls: string[];
}

/** `chitrakathe` shows only the ಚಿತ್ರಕಥೆ box (it is a section, not a book form). */
export type BookFormFilter = BookForm | "all" | "chitrakathe";
