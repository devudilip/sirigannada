"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import type { Proverb } from "../types";

const actionClass = "inline-flex items-center min-h-11 px-2 text-base font-semibold text-accent-strong hover:underline";

/** First Kannada word of the saying, for the "Words →" dictionary link. */
function firstWord(text: string): string {
  return text.replace(/[^ಀ-೿\s]/g, " ").trim().split(/\s+/)[0] ?? "";
}

interface ProverbRowProps {
  proverb: Proverb;
  variants?: Proverb[];
  selected: boolean;
  onSelect: () => void;
}

/**
 * Serif 16/1.55 on a 1 px rule. Tapping selects the row: it fills `bg-elevated` and reveals
 * Save / Share / Copy / Words →. Unselected rows carry no icons so the list reads as an index.
 */
export function ProverbRow({ proverb, variants = [], selected, onSelect }: ProverbRowProps) {
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
    <li className={`rounded-lg border p-4 mb-3 ${selected ? "bg-accent-soft border-accent-strong" : "bg-elevated border-line"}`}>
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className="w-full min-h-11 py-2 text-left font-serif text-lg leading-kannada text-ink hover:bg-elevated"
        lang="kn"
      >
        {proverb.text}
      </button>
      {variants.length > 0 && <details className="text-base text-secondary"><summary className="min-h-11 cursor-pointer">{t("proverbVariants", { n: variants.length })}</summary><ul className="list-disc pl-5" lang="kn">{variants.map((variant) => <li key={variant.id}>{variant.text}</li>)}</ul></details>}
      {selected && (
        <div className="pt-2 border-t border-line"><p className="text-base text-secondary mb-2">{t("proverbScope")}</p><div className="flex flex-wrap items-center justify-between gap-2">
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
        </div></div>
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
