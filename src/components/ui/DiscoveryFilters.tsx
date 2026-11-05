"use client";

import type { ReactNode } from "react";
import { useT } from "@/components/providers/AppProviders";

export function DiscoveryFilters({ active, onReset, children }: { active: boolean; onReset: () => void; children: ReactNode }) {
  const t = useT();
  return <details className="rounded-md border border-line bg-elevated p-3">
    <summary className="min-h-11 cursor-pointer font-semibold text-base text-accent-strong">{t(active ? "discoveryFiltersActive" : "discoveryFilters")}</summary>
    <div className="mt-3 flex flex-col gap-3">
      {children}
      <p className="text-base text-secondary">{t("readingDeviceNote")}</p>
      <button type="button" className="min-h-11 self-start px-3 border border-line rounded-md" onClick={onReset}>{t("discoveryReset")}</button>
    </div>
  </details>;
}
