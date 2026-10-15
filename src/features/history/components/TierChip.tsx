"use client";

import { useT } from "@/components/providers/AppProviders";
import type { EvidenceTier } from "../types";
import { TIER_KEYS } from "../lib/tiers";

const TONE: Record<EvidenceTier, string> = {
  inscription: "bg-gold-soft text-ink",
  scholarship: "bg-elevated text-ink border border-line-strong",
  legend: "bg-paper-edge text-secondary",
};

/** The evidence tier of a fact as a small pill: ಶಾಸನ, ಇತಿಹಾಸಕಾರರ ನಿರ್ಣಯ or ಐತಿಹ್ಯ. */
export function TierChip({ tier, className = "" }: { tier: EvidenceTier; className?: string }) {
  const t = useT();
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${TONE[tier]} ${className}`}>
      {t(TIER_KEYS[tier])}
    </span>
  );
}
