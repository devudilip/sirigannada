"use client";

import { useState } from "react";
import { IconButton } from "@/components/ui/Button";
import { ShareIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import type { Proverb } from "../types";

export function ProverbRow({ proverb }: { proverb: Proverb }) {
  const t = useT();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <li className="border-b border-line py-3 last:border-b-0 flex items-start justify-between gap-2">
      <p className="font-serif text-base text-ink leading-kannada" lang="kn">
        {proverb.text}
      </p>
      <div className="shrink-0 flex items-center">
        <IconButton aria-label={t("shareCardAction")} onClick={() => setShareOpen(true)}>
          <ShareIcon size={20} className="text-muted" />
        </IconButton>
        {proverb.id && <SaveToCollectionButton item={{ kind: "proverb", proverbId: proverb.id }} />}
      </div>
      <ShareCardSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        input={
          shareOpen
            ? { kind: "gade", main: proverb.text, url: `${CANONICAL_ORIGIN}/proverbs`, source: "Wikiquote", size: "portrait" }
            : null
        }
      />
    </li>
  );
}
