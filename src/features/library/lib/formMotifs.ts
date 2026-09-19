import type { ComponentType } from "react";
import { BookIcon, BookOpenIcon, LampIcon, QuillIcon, ShatpadiIcon, TripadiIcon, VeenaIcon } from "@/components/icons";
import type { BookForm } from "@/lib/types";

type MotifIcon = ComponentType<{ size?: number; className?: string }>;

/**
 * The mark drawn on a book that has no cover photograph: a lamp for vachana, three or six lines
 * for tripadi and shatpadi, a veena for kirtane, a quill for poems, an open book for prose.
 * Keeps a photo-less shelf from reading as a row of blank tiles.
 */
export const FORM_MOTIFS: Record<BookForm, MotifIcon> = {
  vachana: LampIcon,
  tripadi: TripadiIcon,
  shatpadi: ShatpadiIcon,
  kirtane: VeenaIcon,
  poem: QuillIcon,
  prose: BookOpenIcon,
  mixed: BookIcon,
};
