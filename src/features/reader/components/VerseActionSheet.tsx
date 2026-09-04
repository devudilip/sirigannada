"use client";

import { useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import { ImageIcon, LinkIcon } from "@/components/icons";

interface VerseActionSheetProps {
  open: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  onShareImage: () => void;
}

/**
 * Long-pressing a verse opens this: pick "copy link" (the original behaviour) or
 * "share as image" (B-03). Kept as a tiny menu rather than replacing the long-press
 * so the existing copy-link flow keeps working unchanged.
 */
export function VerseActionSheet({ open, onClose, onCopyLink, onShareImage }: VerseActionSheetProps) {
  const t = useT();
  return (
    <Sheet open={open} onClose={onClose} title={t("verseActionsSheetTitle")}>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onCopyLink}
          className="flex min-h-11 items-center gap-3 rounded-md border border-line px-3 py-2 text-left text-base text-ink hover:bg-paper"
        >
          <LinkIcon size={20} className="shrink-0 text-secondary" />
          {t("copyLink")}
        </button>
        <button
          type="button"
          onClick={onShareImage}
          className="flex min-h-11 items-center gap-3 rounded-md border border-line px-3 py-2 text-left text-base text-ink hover:bg-paper"
        >
          <ImageIcon size={20} className="shrink-0 text-secondary" />
          {t("shareAsImage")}
        </button>
      </div>
    </Sheet>
  );
}
