"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/** Bordered destination row used on tools, learn, and the home hubs. */
export function DestinationLink({
  href,
  titleKey,
  subKey,
}: {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}) {
  const t = useT();
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-paper p-4 h-full transition-colors hover:border-accent"
    >
      <span className="flex flex-col gap-1 min-w-0">
        <span className="text-lg font-semibold text-ink">{t(titleKey)}</span>
        <span className="text-sm text-secondary">{t(subKey)}</span>
      </span>
      <ArrowRightIcon size={20} className="shrink-0 text-muted group-hover:text-accent transition-colors" />
    </Link>
  );
}
