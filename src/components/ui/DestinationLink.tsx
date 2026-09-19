"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/**
 * List row with a 1 px rule: title, sub-line, trailing arrow. Put rows inside a `<ul>` with
 * `rule-section` on top so the group reads as one block. `compact` keeps the sub-line to two lines.
 */
export function DestinationLink({
  href,
  titleKey,
  subKey,
  compact = false,
}: {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
  compact?: boolean;
}) {
  const t = useT();
  return (
    <Link
      href={href}
      className="group rule-row flex items-center justify-between gap-4 py-3 min-h-14 h-full transition-colors hover:bg-elevated active:bg-paper-edge"
    >
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-lg font-semibold text-ink leading-snug">{t(titleKey)}</span>
        <span className={`text-sm text-secondary ${compact ? "line-clamp-2" : ""}`}>{t(subKey)}</span>
      </span>
      <ArrowRightIcon size={20} className="shrink-0 text-ink" />
    </Link>
  );
}
