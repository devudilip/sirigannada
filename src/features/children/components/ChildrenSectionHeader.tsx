"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { StoryCollection } from "../types";
import { CHILDREN_URL } from "../lib/sections";

/** Section page top: a link back to ಮಕ್ಕಳ ಕಥೆಗಳು, the section's own title and description, and its count. */
export function ChildrenSectionHeader({ collection, count }: { collection: StoryCollection; count: number }) {
  const { locale, t } = useApp();
  const countLabel =
    collection.kind === "stories"
      ? count === 1 ? t("childrenStoryOne") : t("childrenStoryCount", { n: localiseDigits(count, locale) })
      : t("picturebooksCount", { n: localiseDigits(count, locale) });
  return (
    <header className="mb-6">
      <Link href={CHILDREN_URL} className="inline-flex min-h-11 items-center text-accent">{t("childrenTitle")}</Link>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-ink" lang={locale}>{collection.title[locale]}</h1>
        {count > 0 && <p className="text-sm text-muted text-right" lang={locale}>{countLabel}</p>}
      </div>
      <p className="mt-3 text-lg text-secondary" lang={locale}>{collection.description[locale]}</p>
    </header>
  );
}
