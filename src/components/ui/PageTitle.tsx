"use client";

import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/** 28 px page title, flush left. `detail` is a localised count line shown at the right. Sections below carry their own 2 px rules. */
export function PageTitle({ k, sub, detail }: { k: StringKey; sub?: StringKey; detail?: string }) {
  const t = useT();
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink leading-tight">{t(k)}</h1>
        {detail && <p className="text-sm text-muted max-w-[55%] text-right">{detail}</p>}
      </div>
      {sub && <p className="mt-1 text-base text-secondary">{t(sub)}</p>}
    </div>
  );
}
