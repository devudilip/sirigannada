"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { IconButton } from "@/components/ui/Button";
import { InstallButton } from "@/components/pwa/InstallButton";
import { MoonIcon, SunIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { DESKTOP_NAV_ITEMS, isActive } from "./navItems";
import { useOfflineReady } from "./useOfflineReady";

/** Desktop header on a 2 px ink rule: mark + wordmark, Kannada links, offline status, Install. */
export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme, locale, setLocale, t } = useApp();
  const offlineReady = useOfflineReady();

  return (
    <header className="no-print sticky top-0 z-40 bg-surface border-b-2 border-line-strong">
      <div className="mx-auto max-w-6xl px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label={t("appName")}>
          <Wordmark size={32} showLatin />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label={t("navPrimary")}>
          {DESKTOP_NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.labelKey}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 h-11 inline-flex items-center text-base font-semibold border-b-2 transition-colors ${
                  active ? "text-accent border-accent" : "text-ink border-transparent hover:bg-elevated"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-2 text-sm text-ink mr-2" aria-live="polite">
            <span aria-hidden="true" className={`size-2 ${offlineReady ? "bg-ink" : "bg-paper-edge"}`} />
            {offlineReady ? t("navOfflineReady") : t("navOnlineOnly")}
          </span>
          <InstallButton className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={() => setLocale(locale === "kn" ? "en" : "kn")}
            className="h-11 px-3 text-sm font-semibold text-ink hover:bg-elevated transition-colors"
            aria-label={t("language")}
          >
            {t("language")}
          </button>
          <IconButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t("theme")}>
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </IconButton>
        </div>
      </div>
    </header>
  );
}
