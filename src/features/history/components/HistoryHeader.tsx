"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProviders";
import type { LocalizedText } from "@/lib/types";

/** Listing page top: the link one level up, the title and description, and a count on the right. */
export function HistoryHeader({ up, title, description, count, children }: {
  up: { href: string; label: string };
  title: LocalizedText;
  description: LocalizedText;
  count?: string;
  children?: ReactNode;
}) {
  const { locale } = useApp();
  return (
    <header className="mb-6">
      <Link href={up.href} className="inline-flex min-h-11 items-center text-accent">{up.label}</Link>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-ink" lang={locale}>{title[locale]}</h1>
        {count && <p className="text-sm text-muted text-right" lang={locale}>{count}</p>}
      </div>
      {children}
      <p className="mt-3 text-lg text-secondary" lang={locale}>{description[locale]}</p>
    </header>
  );
}
