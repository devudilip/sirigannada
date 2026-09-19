/**
 * Which page a horizontal, snap-scrolling strip is showing, from its `scrollLeft`. Each page is
 * one viewport wide, so the index is the nearest whole multiple of that width; clamped so rounding
 * error near the very end never reports an out-of-range page.
 */
export function pageIndexFromScroll(scrollLeft: number, pageWidth: number, pageCount: number): number {
  if (pageCount <= 0 || pageWidth <= 0) return 0;
  const index = Math.round(scrollLeft / pageWidth);
  return Math.min(pageCount - 1, Math.max(0, index));
}

/** The `scrollLeft` that centres `page` in a strip of `pageWidth`-wide pages. */
export function scrollForPage(page: number, pageWidth: number): number {
  return Math.max(0, page) * pageWidth;
}
