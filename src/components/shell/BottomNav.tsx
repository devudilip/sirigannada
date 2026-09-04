"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/providers/AppProviders";
import { NAV_ITEMS, isActive } from "./navItems";
import { NavIcon } from "./NavIcon";

export function BottomNav() {
  const pathname = usePathname();
  const t = useT();
  return (
    <nav
      aria-label={t("navPrimary")}
      className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 bg-elevated/95 backdrop-blur border-t border-line safe-bottom"
    >
      <ul className="grid grid-cols-5 h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`h-full flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <NavIcon icon={item.icon} />
                <span>{t(item.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
