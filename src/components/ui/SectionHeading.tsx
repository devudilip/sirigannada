"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/** Section title with an optional "see all" link. Title and link come from i18n keys. */
export function SectionHeading({ k, href, linkKey }: { k: StringKey; href?: string; linkKey?: StringKey }) {
  const t = useT();
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="text-xl font-semibold text-ink">{t(k)}</h2>
      {href && linkKey && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-accent hover:underline"
        >
          {t(linkKey)} <ArrowRightIcon size={16} />
        </Link>
      )}
    </div>
  );
}
