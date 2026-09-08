"use client";

import { useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import { LinkIcon, ShareIcon } from "@/components/icons";

interface VerseActionSheetProps {
  open: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  /** Reusable share card (S-01): kind chip + brand header. */
  onShareCard: () => void;
}

const rowClass =
  "flex min-h-12 w-full items-center gap-3 rule-row py-2 text-left text-base text-ink hover:bg-elevated active:bg-paper-edge";

/** Long-pressing a verse opens this: copy link, or share the verse as an image card (S-01). */
export function VerseActionSheet({ open, onClose, onCopyLink, onShareCard }: VerseActionSheetProps) {
  const t = useT();
  return (
    <Sheet open={open} onClose={onClose} title={t("verseActionsSheetTitle")}>
      <div className="flex flex-col">
        <button type="button" onClick={onCopyLink} className={rowClass}>
          <LinkIcon size={20} className="shrink-0 text-secondary" />
          {t("copyLink")}
        </button>
        <button type="button" onClick={onShareCard} className={rowClass}>
          <ShareIcon size={20} className="shrink-0 text-secondary" />
          {t("shareCardAction")}
        </button>
      </div>
    </Sheet>
  );
}
