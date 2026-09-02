export type Paper = "light" | "sepia" | "night";
export type ReaderFont = "serif" | "sans";

export interface ReaderSettings {
  /** Multiplier on the base reading size. 0.85 – 1.6 in steps of 0.1. */
  fontScale: number;
  paper: Paper;
  font: ReaderFont;
}

export const DEFAULT_SETTINGS: ReaderSettings = { fontScale: 1, paper: "light", font: "serif" };
export const FONT_SCALE_MIN = 0.85;
export const FONT_SCALE_MAX = 1.6;
export const FONT_SCALE_STEP = 0.1;

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
