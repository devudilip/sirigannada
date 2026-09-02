"use client";

import { StarIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import { hasKannada } from "@/lib/kannada";

interface SavedWordRowProps {
  word: string;
  onPick: (word: string) => void;
  starred?: boolean;
  onToggleStar?: (word: string) => void;
}

export function SavedWordRow({ word, onPick, starred, onToggleStar }: SavedWordRowProps) {
  const t = useT();
  return (
    <div className="flex items-center gap-1 min-h-11">
      <button
        type="button"
        onClick={() => onPick(word)}
        className="flex-1 min-w-0 text-left px-3 py-2 rounded-md hover:bg-paper text-base text-ink font-serif"
        lang={hasKannada(word) ? "kn" : "en"}
      >
        {word}
      </button>
      {onToggleStar && (
        <IconButton
          aria-label={starred ? t("unstarWord") : t("starWord")}
          aria-pressed={starred}
          onClick={() => onToggleStar(word)}
        >
          <StarIcon size={20} filled={starred} className={starred ? "text-accent" : "text-muted"} />
        </IconButton>
      )}
    </div>
  );
}
