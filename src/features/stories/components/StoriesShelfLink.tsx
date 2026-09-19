"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { strings } from "@/lib/i18n";

/** Elevated card at the top of the library shelf pointing to /stories, with a gold top rule. */
export function StoriesShelfLink() {
  const { locale, t } = useApp();
  return (
    <Link
      href="/stories"
      className="flex items-center justify-between gap-4 min-h-16 rounded-lg bg-elevated border border-line border-t-[3px] border-t-gold shadow-elevated px-4 py-3 hover:border-ink transition-colors active:bg-paper-edge"
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-lg font-semibold leading-snug text-ink">
          <span lang="kn">{strings.navStories.kn}</span>
          <span lang="en" className="font-latin text-base font-normal text-muted"> · {strings.navStories.en}</span>
        </span>
        <span className="text-sm text-secondary" lang={locale}>
          {t("storiesSub")}
        </span>
      </span>
      <ArrowRightIcon size={20} className="shrink-0 text-ink" />
    </Link>
  );
}
