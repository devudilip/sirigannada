"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";

/** Essential footer links only; full project information and socials live in More and Contact. */
export function SiteFooter() {
  const t = useT();
  return (
    <footer className="no-print mt-10 border-t border-line bg-elevated">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span className="text-base font-semibold">{t("appName")}</span>
        <nav aria-label={t("footerNav")} className="flex flex-wrap gap-x-5">
          {([{ href: "/about", key: "navAbout" }, { href: "/privacy", key: "navPrivacy" }, { href: "/more", key: "navMore" }] as const).map((item) => <Link key={item.href} href={item.href} className="min-h-11 inline-flex items-center text-base text-secondary hover:text-accent-strong">{t(item.key)}</Link>)}
        </nav>
        <p className="text-sm text-muted">{t("footerLicence")}</p>
      </div>
    </footer>
  );
}
