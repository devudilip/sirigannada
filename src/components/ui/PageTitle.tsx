"use client";

import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

export function PageTitle({ k, sub }: { k: StringKey; sub?: StringKey }) {
  const t = useT();
  return (
    <div className="mb-6">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink">{t(k)}</h1>
      {sub && <p className="mt-1 text-secondary">{t(sub)}</p>}
    </div>
  );
}
