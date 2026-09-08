"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/** List row on a 1 px rule: Kannada title, muted sub inline after it, trailing arrow. */
export function HomeRow({ href, titleKey, subKey }: { href: string; titleKey: StringKey; subKey: StringKey }) {
  const { locale, t } = useApp();
  return (
    <Link
      href={href}
      className="rule-row flex items-center justify-between gap-4 py-4 min-h-14 hover:bg-elevated active:bg-paper-edge"
    >
      <span className="flex min-w-0 items-baseline gap-3">
        <span className="text-lg font-semibold text-ink leading-snug" lang={locale}>
          {t(titleKey)}
        </span>
        <span className="text-base text-muted truncate" lang="en">
          {t(subKey)}
        </span>
      </span>
      <ArrowRightIcon size={20} className="shrink-0 text-ink" />
    </Link>
  );
}
