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
  compact = false,
}: {
  title: string;
  form?: BookForm;
  className?: string;
  accent?: boolean;
  compact?: boolean;
}) {
  const Motif = form ? FORM_MOTIFS[form] : null;
  return (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 overflow-hidden rounded-md bg-elevated border border-line border-t-[3px] ${accent ? "border-t-accent" : "border-t-ink"} ${compact ? "p-1.5" : "p-4 bg-gold-soft"} ${className}`}
    >
      <span className={`block font-serif font-semibold leading-kannada text-ink ${compact ? "text-xs line-clamp-3" : "text-lg sm:text-xl"}`} lang="kn">
        {title}
      </span>
      {Motif && <Motif size={compact ? 16 : 40} className="absolute bottom-1.5 left-1.5 text-accent" />}
    </span>
  );
}
