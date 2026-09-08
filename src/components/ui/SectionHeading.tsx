"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/**
 * Section header on a 2 px ink rule: coral kicker (Kannada · ENGLISH) with an optional trailing
 * link. `variant="title"` renders the larger 20 px heading used mid-page instead of a kicker.
 */
export function SectionHeading({
  k,
  href,
  linkKey,
  variant = "kicker",
  detail,
}: {
  k: StringKey;
  href?: string;
  linkKey?: StringKey;
  variant?: "kicker" | "title";
  /** Free text after the title, e.g. a count. Already localised by the caller. */
  detail?: string;
}) {
  const t = useT();
  return (
    <div className="rule-section flex items-baseline justify-between gap-4 pt-3 mb-3">
      {variant === "kicker" ? (
        <h2 className="kicker text-accent-strong">
          {t(k)}
          {detail ? <span className="text-muted"> · {detail}</span> : null}
        </h2>
      ) : (
        <h2 className="text-xl font-semibold text-ink">
          {t(k)}
          {detail ? <span className="text-sm font-normal text-muted"> · {detail}</span> : null}
        </h2>
      )}
      {href && linkKey && (
        <Link href={href} className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-accent-strong hover:underline">
          {t(linkKey)} <ArrowRightIcon size={16} />
        </Link>
      )}
    </div>
  );
}
