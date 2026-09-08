"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/providers/AppProviders";
import { strings } from "@/lib/i18n";
import { MOBILE_NAV_ITEMS, isActive } from "./navItems";
import { NavIcon } from "./NavIcon";

/**
 * Five-column bottom bar on a 2 px ink rule. Each item: 22 px icon, Kannada label, small
 * uppercase English. Kannada always leads regardless of locale (brand rule). Active = coral.
 */
export function BottomNav() {
  const pathname = usePathname();
  const t = useT();
  return (
    <nav
      aria-label={t("navPrimary")}
      className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t-2 border-line-strong safe-bottom"
    >
      <ul className="grid grid-cols-5 h-16">
        {MOBILE_NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? "text-accent" : "text-ink"
                }`}
              >
                <NavIcon icon={item.icon} />
                <span className="text-xs font-semibold leading-none" lang="kn">{strings[item.labelKey].kn}</span>
                <span className="text-[9px] font-latin uppercase tracking-kicker leading-none" lang="en">{strings[item.labelKey].en}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
