"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type RefObject } from "react";
import type { PageLayout, ReaderSettings, StageMode } from "../types";

const SPREAD_MIN_WIDTH = 900;
const MAX_PAGE_WIDTH = 560;
const MAX_PAGE_HEIGHT = 820;
const GAP = 48;

interface Box {
  width: number;
  height: number;
}

type Geometry = Omit<PageLayout, "pageCount">;

/** Choose page size and mode from the available stage box. */
export function computeGeometry(box: Box): Geometry {
  const mode: StageMode = box.width >= SPREAD_MIN_WIDTH && box.width > box.height * 0.9 ? "spread" : "single";
  const columns = mode === "spread" ? 2 : 1;
  const pageWidth = Math.floor(Math.min(MAX_PAGE_WIDTH, box.width / columns));
  const pageHeight = Math.floor(Math.min(MAX_PAGE_HEIGHT, box.height));
  const padding = pageWidth < 400 ? 22 : 40;
  return { mode, pageWidth, pageHeight, gap: GAP, padding };
}

/** Text column size inside a page. */
export function textBox(layout: Geometry): { width: number; height: number; stride: number } {
  const width = layout.pageWidth - 2 * layout.padding;
  const height = layout.pageHeight - 2 * layout.padding - 28; // room for the page number line
  return { width, height, stride: width + layout.gap };
}

/**
 * Measures the stage container and the hidden measuring flow to produce a full PageLayout.
 * Re-measures on resize, when settings change (font size reflows the columns), and once fonts load.
 * Measurement is synchronous in a layout effect — no animation frames involved.
 */
export function usePageLayout(
  stageRef: RefObject<HTMLElement | null>,
  measureRef: RefObject<HTMLElement | null>,
  settings: ReaderSettings,
  contentKey: string
): PageLayout | null {
  const [box, setBox] = useState<Box | null>(null);
  const [pageCount, setPageCount] = useState(1);

  const geometry = useMemo(() => (box && box.width >= 100 && box.height >= 100 ? computeGeometry(box) : null), [box]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = (width: number, height: number) =>
      setBox((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
    // Measure immediately, then keep in sync. ResizeObserver covers rotation, keyboard, and split view.
    const rect = el.getBoundingClientRect();
    update(rect.width, rect.height);
    const ro = new ResizeObserver(([entry]) => {
      if (entry) update(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(el);
    const onResize = () => {
      const r = el.getBoundingClientRect();
      update(r.width, r.height);
    };
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [stageRef]);

  useLayoutEffect(() => {
    if (!geometry) return;
    let cancelled = false;
    const measure = () => {
      const flow = measureRef.current;
      if (!flow || cancelled) return;
      const { stride } = textBox(geometry);
      setPageCount(Math.max(1, Math.round((flow.scrollWidth + geometry.gap) / stride)));
    };
    measure();
    document.fonts?.ready.then(() => setTimeout(measure, 0));
    return () => {
      cancelled = true;
    };
  }, [geometry, settings.fontScale, settings.font, contentKey, measureRef]);

  return useMemo(() => (geometry ? { ...geometry, pageCount } : null), [geometry, pageCount]);
}
