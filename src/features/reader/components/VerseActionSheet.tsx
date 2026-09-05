"use client";

import { useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import { ImageIcon, LinkIcon, ShareIcon } from "@/components/icons";

interface VerseActionSheetProps {
  open: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  /** New reusable share card (S-01): kind chip + watermarks. */
  onShareCard: () => void;
  /** Original framed verse image (B-03). */
  onShareImage: () => void;
}

const rowClass =
  "flex min-h-11 items-center gap-3 rounded-md border border-line px-3 py-2 text-left text-base text-ink hover:bg-paper";

/**
 * Long-pressing a verse opens this: copy link, share as a card (the shared S-01 renderer), or
 * the original framed verse image (B-03). Both image options are offered while the new card is
 * being evaluated against the old one.
 */
export function VerseActionSheet({ open, onClose, onCopyLink, onShareCard, onShareImage }: VerseActionSheetProps) {
  const t = useT();
  return (
    <Sheet open={open} onClose={onClose} title={t("verseActionsSheetTitle")}>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={onCopyLink} className={rowClass}>
          <LinkIcon size={20} className="shrink-0 text-secondary" />
          {t("copyLink")}
        </button>
        <button type="button" onClick={onShareCard} className={rowClass}>
          <ShareIcon size={20} className="shrink-0 text-secondary" />
          {t("shareCardVerseMenu")}
        </button>
        <button type="button" onClick={onShareImage} className={rowClass}>
          <ImageIcon size={20} className="shrink-0 text-secondary" />
          {t("shareAsImage")}
        </button>
      </div>
    </Sheet>
  );
}
