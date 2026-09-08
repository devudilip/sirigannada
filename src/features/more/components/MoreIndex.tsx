"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MINE, UTILITIES } from "../lib/catalog";

/** 1k More: two rule-separated groups of rows, then the footer links. */
export function MoreIndex() {
  const { locale, setLocale, t } = useApp();
  return (
    <div className="flex flex-col gap-8">
      <section>
        <SectionHeading k="moreMine" />
        <ul>
          {MINE.map((row) => (
            <li key={row.href}><DestinationLink href={row.href} titleKey={row.titleKey} subKey={row.subKey} compact /></li>
          ))}
        </ul>
      </section>
      <section>
        <SectionHeading k="moreTools" />
        <ul>
          {UTILITIES.map((row) => (
            <li key={row.href}><DestinationLink href={row.href} titleKey={row.titleKey} subKey={row.subKey} compact /></li>
          ))}
        </ul>
      </section>
      <nav aria-label={t("moreFooter")} className="flex flex-wrap gap-x-6 gap-y-2 text-base text-secondary">
        <Link href="/about" className="min-h-11 inline-flex items-center hover:text-ink">{t("navAbout")}</Link>
        <Link href="/credits" className="min-h-11 inline-flex items-center hover:text-ink">{t("seeAllCredits")}</Link>
        <button type="button" onClick={() => setLocale(locale === "kn" ? "en" : "kn")} className="min-h-11 inline-flex items-center hover:text-ink">
          {t("language")}
        </button>
      </nav>
    </div>
  );
}
