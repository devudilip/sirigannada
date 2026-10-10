"use client";

import { useApp } from "@/components/providers/AppProviders";
import type { HistoryFact } from "../types";
import { TierChip } from "./TierChip";

/**
 * One sourced statement: the text in the UI language, its tier, the source (with a link when
 * there is one), the quotation if any, and a ವಿವಾದಿತ marker when historians disagree.
 */
export function FactLine({ fact, showTier = true, compact = false }: { fact: HistoryFact; showTier?: boolean; compact?: boolean }) {
  const { locale, t } = useApp();
  return (
    <li className={`flex flex-col gap-1 ${compact ? "text-sm" : "text-base"}`}>
      <p className="text-ink" lang={locale}>{fact.text[locale]}</p>
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {showTier && <TierChip tier={fact.tier} />}
        {fact.url ? (
          <a href={fact.url} target="_blank" rel="noopener noreferrer" className="underline text-accent">{fact.source}</a>
        ) : (
          <span>{fact.source}</span>
        )}
      </p>
      {!compact && fact.quote && (
        <blockquote className="border-l-2 border-line-strong pl-3 text-sm italic text-secondary">
          <span className="not-italic text-muted">{t("historyQuote")}: </span>{fact.quote}
        </blockquote>
      )}
      {fact.disputed && (
        <p className="flex flex-wrap items-start gap-2 text-sm text-secondary">
          <span className="inline-flex shrink-0 items-center rounded-full border border-accent px-2 py-0.5 text-xs font-semibold text-accent">{t("historyDisputed")}</span>
          <span lang={locale}>{fact.disputed[locale]}</span>
        </p>
      )}
    </li>
  );
}
