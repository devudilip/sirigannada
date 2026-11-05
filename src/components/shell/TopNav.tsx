"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { IconButton } from "@/components/ui/Button";
import { MoonIcon, SunIcon, MenuIcon, CloseIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { DESKTOP_NAV_ITEMS, isActive } from "./navItems";

/** The same destinations are available at every width, including tablets. */
export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme, locale, setLocale, t } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <header className="no-print sticky top-0 z-40 bg-elevated border-b border-line">
      <div className="mx-auto max-w-7xl px-2 sm:px-5 md:px-10 py-3 flex items-center justify-between gap-2">
        <Link href="/" onClick={() => setOpen(false)} aria-label={t("navHome")}>
          <Wordmark size={24} showLatin />
        </Link>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setLocale(locale === "kn" ? "en" : "kn")} className="min-h-11 px-2 rounded-md font-semibold hover:bg-surface" aria-label={t("language")} lang={locale === "kn" ? "en" : "kn"}>
            {t("languageSwitchLabel")}
          </button>
          <IconButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t("theme")}>
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </IconButton>
          <button type="button" id="section-menu-toggle" aria-label={t("navSections")} aria-expanded={open} aria-controls="section-navigation" onClick={() => setOpen(!open)} className="min-h-11 px-3 flex items-center gap-2 rounded-md bg-surface font-semibold min-[1033px]:hidden">
            {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}<span className="hidden sm:inline">{t("navSections")}</span>
          </button>
        </div>
      </div>
      <nav onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); document.getElementById("section-menu-toggle")?.focus(); } }} id="section-navigation" aria-label={t("navSections")} className={`${open ? "block" : "hidden"} min-[1033px]:block border-t border-line max-h-[70dvh] overflow-y-auto`}>
        <div className="mx-auto max-w-7xl px-5 md:px-10 grid grid-cols-2 gap-1 py-2 min-[1033px]:flex min-[1033px]:flex-wrap">
          {DESKTOP_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`min-h-11 px-4 py-2 rounded-md text-base font-semibold ${isActive(pathname, item.href) ? "bg-accent-soft text-accent-text" : "text-secondary hover:bg-surface hover:text-ink"}`}>
              {t(item.labelKey)}
            </Link>
          ))}
          <Link href="/more" onClick={() => setOpen(false)} className="min-h-11 px-4 py-2 rounded-md text-base font-semibold text-secondary hover:bg-surface">{t("navMore")}</Link>
        </div>
      </nav>
    </header>
  );
}
