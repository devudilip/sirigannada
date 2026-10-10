import type { BookForm } from "@/lib/types";

export interface OfflineWarmProgress {
  done: number;
  total: number;
  failedUrls: string[];
}

/**
 * Chips for the non-book boxes on the shelf (ಚಿತ್ರಕಥೆ, ಕರ್ನಾಟಕ ಇತಿಹಾಸ): each shows only its own box.
 * `karnataka-itihasa` is distinct from the `itihasa` book form, which is a chip of its own.
 */
export const SECTION_FILTERS = ["chitrakathe", "karnataka-itihasa"] as const;
export type SectionFilter = (typeof SECTION_FILTERS)[number];
export type BookFormFilter = BookForm | "all" | SectionFilter;

export function isSectionFilter(value: BookFormFilter): value is SectionFilter {
  return (SECTION_FILTERS as readonly string[]).includes(value);
}
