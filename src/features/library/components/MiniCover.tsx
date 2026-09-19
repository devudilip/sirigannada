import { FORM_MOTIFS } from "../lib/formMotifs";
import type { BookForm } from "@/lib/types";

/**
 * Drawn fallback cover for a book with no photograph: surface fill, 3 px ink rule on top, title
 * in the serif at the top-left, and — when the literary form is known — its motif in the accent
 * colour at the bottom-left. Size comes from the caller via `className` (e.g. `w-16 h-22`).
 * Decorative: the row's link already carries the title, so this is hidden from assistive tech.
 */
export function MiniCover({
  title,
  form,
  className = "",
  accent = false,
}: {
  title: string;
  form?: BookForm;
  className?: string;
  accent?: boolean;
}) {
  const Motif = form ? FORM_MOTIFS[form] : null;
  return (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 overflow-hidden rounded-md bg-elevated border border-line border-t-[3px] ${accent ? "border-t-accent" : "border-t-ink"} p-1.5 ${className}`}
    >
      <span className="block font-serif font-semibold text-xs leading-normal text-ink line-clamp-3" lang="kn">
        {title}
      </span>
      {Motif && <Motif size={16} className="absolute bottom-1.5 left-1.5 text-accent" />}
    </span>
  );
}
