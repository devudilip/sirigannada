"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import type { Proverb } from "../types";

const actionClass = "inline-flex items-center min-h-11 px-2 text-xs font-semibold text-accent-strong hover:underline";

/** First Kannada word of the saying, for the "Words →" dictionary link. */
function firstWord(text: string): string {
  return text.replace(/[^ಀ-೿\s]/g, " ").trim().split(/\s+/)[0] ?? "";
}

interface ProverbRowProps {
  proverb: Proverb;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Serif 16/1.55 on a 1 px rule. Tapping selects the row: it fills `bg-elevated` and reveals
 * Save / Share / Copy / Words →. Unselected rows carry no icons so the list reads as an index.
 */
export function ProverbRow({ proverb, selected, onSelect }: ProverbRowProps) {
  const t = useT();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(proverb.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const word = firstWord(proverb.text);

  return (
    <li className={`rule-row ${selected ? "bg-elevated -mx-2 px-2" : ""}`}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="w-full min-h-11 py-3 text-left font-serif text-[1rem] leading-[1.55] text-ink hover:bg-elevated"
        lang="kn"
      >
        {proverb.text}
      </button>
      {selected && (
        <div className="flex items-center justify-between gap-2 pb-1 -ml-2">
          <div className="flex items-center">
            {proverb.id && <SaveToCollectionButton item={{ kind: "proverb", proverbId: proverb.id }} />}
            <button type="button" onClick={() => setShareOpen(true)} className={actionClass}>
              {t("proverbShare")}
            </button>
            <button type="button" onClick={() => void copy()} className={actionClass}>
              {copied ? t("copied") : t("proverbCopy")}
            </button>
          </div>
          {word && (
            <Link href={`/dictionary?q=${encodeURIComponent(word)}`} className={actionClass}>
              {t("proverbWords")} →
            </Link>
          )}
        </div>
      )}
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
