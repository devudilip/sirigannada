/**
 * Tiny typographic cover: surface fill, 3 px ink rule on top, title in the serif at the top-left.
 * Size comes from the caller via `className` (e.g. `w-16 h-22`). Decorative — the row's link
 * already carries the title, so the text here is hidden from assistive tech.
 */
export function MiniCover({ title, className = "", accent = false }: { title: string; className?: string; accent?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 overflow-hidden rounded-md bg-elevated border border-line border-t-[3px] ${accent ? "border-t-accent" : "border-t-ink"} p-1.5 ${className}`}
    >
      <span className="block font-serif font-semibold text-xs leading-normal text-ink line-clamp-3" lang="kn">
        {title}
      </span>
    </span>
  );
}
