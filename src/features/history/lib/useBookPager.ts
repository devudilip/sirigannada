"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pageIndexFromScroll, scrollForPage } from "@/features/picturebooks/lib/pageIndex";
import { DEFAULT_TEXT_SIZE, nextTextSize, readTextSize, writeTextSize, type TextSize } from "@/features/picturebooks/lib/textSize";

/**
 * The paging state of a horizontal snap strip, as the picture-book and ಚಿತ್ರಕಥೆ readers use it:
 * the current page, smooth (or reduced-motion) scrolling to a page, ← → keys, taps on the outer
 * thirds, and the remembered Aa text size.
 */
export function useBookPager(total: number) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => setSize(readTextSize()), []);
  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const goTo = useCallback((target: number) => {
    const el = stripRef.current;
    if (!el) return;
    const next = Math.min(total - 1, Math.max(0, target));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: scrollForPage(next, el.clientWidth), behavior: reduced ? "auto" : "smooth" });
  }, [total]);

  const onScroll = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const el = stripRef.current;
      if (el) setPage(pageIndexFromScroll(el.scrollLeft, el.clientWidth, total));
    });
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(page - 1);
      else if (e.key === "ArrowRight") goTo(page + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, page]);

  const onStripClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, summary, details, blockquote")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goTo(page - 1);
    else if (x > (rect.width * 2) / 3) goTo(page + 1);
  }, [goTo, page]);

  const cycleSize = useCallback(() => {
    setSize((s) => {
      const n = nextTextSize(s);
      writeTextSize(n);
      return n;
    });
  }, []);

  return { page, size, stripRef, goTo, onScroll, onStripClick, cycleSize };
}
