"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { LogoMark } from "@/components/ui/LogoMark";
import { GITHUB_REPO } from "@/features/contact/lib/channels";

const LINKS = [
  { href: "/about", key: "navAbout" },
  { href: "/credits", key: "navCredits" },
  { href: "/contact", key: "navContact" },
] as const;

/** Site footer on a 2 px ink rule: mono mark, four links, one licence line. Hidden in the reader. */
export function SiteFooter() {
  const t = useT();
  const link = "min-h-11 inline-flex items-center text-sm font-semibold text-ink hover:text-accent-strong";
  return (
    <footer className="no-print mt-12 border-t-2 border-line-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-ink">
          <LogoMark size={20} variant="mono" />
          <span className="font-serif font-bold text-base" lang="kn">ಸಿರಿಗನ್ನಡ</span>
        </div>
        <nav aria-label={t("footerNav")} className="flex flex-wrap gap-x-6">
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {t(item.key)}
            </Link>
          ))}
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className={link}>
            {t("aboutGithub")}
          </a>
        </nav>
        <p className="text-xs text-muted">{t("footerLicence")}</p>
      </div>
    </footer>
  );
}
