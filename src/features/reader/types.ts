export type Paper = "light" | "sepia" | "night";
export type ReaderFont = "serif" | "sans";
export type ReaderLineHeight = "tight" | "normal" | "loose";
export type ReaderMargin = "compact" | "normal" | "wide";

export interface ReaderSettings {
  /** Multiplier on the base reading size. 0.85 – 1.6 in steps of 0.1. */
  fontScale: number;
  paper: Paper;
  font: ReaderFont;
  lineHeight: ReaderLineHeight;
  margin: ReaderMargin;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  fontScale: 1,
  paper: "light",
  font: "serif",
  lineHeight: "normal",
  margin: "normal",
};
export const FONT_SCALE_MIN = 0.85;
export const FONT_SCALE_MAX = 1.6;
export const FONT_SCALE_STEP = 0.1;

/** Unitless line-height. Tight stays near Kannada’s 1.7 floor; normal ≈ token `--sg-leading-kannada`. */
export const LINE_HEIGHT: Record<ReaderLineHeight, number> = { tight: 1.6, normal: 1.8, loose: 2.0 };
export const LINE_HEIGHTS: ReaderLineHeight[] = ["tight", "normal", "loose"];
export const MARGINS: ReaderMargin[] = ["compact", "normal", "wide"];

/** Inner page padding (px). `narrow` when pageWidth < 400. Normal matches the previous 22/40 defaults. */
export const PAGE_PADDING: Record<ReaderMargin, { narrow: number; wide: number }> = {
  compact: { narrow: 14, wide: 24 },
  normal: { narrow: 22, wide: 40 },
  wide: { narrow: 32, wide: 56 },
};

export function pagePadding(pageWidth: number, margin: ReaderMargin): number {
  const spec = PAGE_PADDING[margin];
  return pageWidth < 400 ? spec.narrow : spec.wide;
}

/** Saved reading position: the first block visible on the page. Survives font-size changes. */
export interface Progress {
  block: number;
  /** 1-based page index at last save; omitted in older records. */
  page?: number;
  updatedAt: number;
}

/** "single": one page fills the stage. "spread": two pages side by side around a spine. */
export type StageMode = "single" | "spread";

export interface PageLayout {
  mode: StageMode;
  /** Width and height of ONE page in px. */
  pageWidth: number;
  pageHeight: number;
  /** Horizontal gap between columns in the flow (px). Also the stride offset. */
  gap: number;
  /** Inner padding of a page around the text column (px). Text width = pageWidth - 2*padding. */
  padding: number;
  /** Total pages in the flow (>= 1). */
  pageCount: number;
}

export type FlipDirection = "forward" | "backward";
