/**
 * Pure helpers for the page-turn. No DOM. Unit-tested.
 */
import type { FlipDirection, StageMode } from "../types";

/** Pages are 0-based. A "view" is what the stage shows: one page, or a spread of two. */
export function viewCount(pageCount: number, mode: StageMode): number {
  return mode === "single" ? pageCount : Math.ceil(pageCount / 2);
}

export function viewOfPage(page: number, mode: StageMode): number {
  return mode === "single" ? page : Math.floor(page / 2);
}

/** Pages shown in a view: [left, right] for spreads, [page] for single. -1 = blank. */
export function pagesInView(view: number, pageCount: number, mode: StageMode): [number, number] {
  if (mode === "single") return [view, -1];
  const left = view * 2;
  const right = left + 1;
  return [left < pageCount ? left : -1, right < pageCount ? right : -1];
}

export interface LeafPlan {
  /** Page rendered on the leaf face that starts facing the reader. */
  front: number;
  /** Page rendered on the leaf's back face (visible during the second half of the turn). */
  back: number;
  /** Static pages under the leaf while it turns: [left, right] (-1 = blank). */
  under: [number, number];
  /** Which side of the spine the leaf starts on. */
  side: "left" | "right";
  /** Rotation in degrees at progress 0 and 1. */
  startAngle: number;
  endAngle: number;
}

export function angleAt(plan: LeafPlan, progress: number): number {
  return plan.startAngle + (plan.endAngle - plan.startAngle) * progress;
}

/**
 * Decide what to render for a turn from `view` in `direction`.
 * Single mode: the leaf is the whole stage, pivoting on its left edge.
 * Spread mode: the leaf is one half, pivoting on the spine.
 */
export function planLeaf(view: number, direction: FlipDirection, pageCount: number, mode: StageMode): LeafPlan {
  const [l, r] = pagesInView(view, pageCount, mode);
  if (mode === "single") {
    return direction === "forward"
      ? { front: l, back: -1, under: [l + 1 < pageCount ? l + 1 : -1, -1], side: "left", startAngle: 0, endAngle: -180 }
      : { front: l - 1, back: -1, under: [l, -1], side: "left", startAngle: -180, endAngle: 0 };
  }
  if (direction === "forward") {
    const nextL = r + 1 < pageCount ? r + 1 : -1;
    const nextR = r + 2 < pageCount ? r + 2 : -1;
    return { front: r, back: nextL, under: [l, nextR], side: "right", startAngle: 0, endAngle: -180 };
  }
  const prevR = l - 1;
  const prevL = l - 2;
  return { front: l, back: prevR, under: [prevL >= 0 ? prevL : -1, r], side: "left", startAngle: 0, endAngle: 180 };
}

export function canTurn(view: number, direction: FlipDirection, pageCount: number, mode: StageMode): boolean {
  const total = viewCount(pageCount, mode);
  return direction === "forward" ? view < total - 1 : view > 0;
}

/** Map a horizontal drag distance to turn progress in [0, 1]. */
export function dragProgress(dx: number, direction: FlipDirection, width: number): number {
  const signed = direction === "forward" ? -dx : dx;
  return Math.min(1, Math.max(0, signed / Math.max(1, width)));
}

/** Ease-out cubic for the release animation. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Shade strength for the leaf while turning: strongest when edge-on. */
export function shade(progress: number): number {
  return Math.sin(Math.PI * Math.min(1, Math.max(0, progress))) * 0.28;
}

/** Page index containing an element at `offsetLeft` within a flow of `stride`-wide columns. */
export function pageOfOffset(offsetLeft: number, stride: number): number {
  return Math.max(0, Math.floor((offsetLeft + 1) / Math.max(1, stride)));
}
