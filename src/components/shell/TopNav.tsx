"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { IconButton } from "@/components/ui/Button";
import { MoonIcon, SunIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { NAV_ITEMS, isActive } from "./navItems";

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme, locale, setLocale, t } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 rounded-md" aria-label={t("appName")}>
          <Wordmark size={30} />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 h-10 inline-flex items-center rounded-md text-base font-medium transition-colors ${
                  active ? "text-accent bg-accent-soft" : "text-secondary hover:text-ink hover:bg-paper"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLocale(locale === "kn" ? "en" : "kn")}
            className="h-9 px-3 rounded-md text-sm font-medium text-secondary hover:text-ink hover:bg-paper transition-colors"
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
