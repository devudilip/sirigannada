"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/** Section title with an optional "see all" link. Title comes from i18n key. */
export function SectionHeading({ k, href }: { k: StringKey; href?: string }) {
  const t = useT();
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="text-xl font-semibold text-ink">{t(k)}</h2>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
          {t("navLibrary")} <ArrowRightIcon size={16} />
        </Link>
      )}
    </div>
  );
}
