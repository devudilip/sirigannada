"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/providers/AppProviders";
import { MOBILE_NAV_ITEMS, isTabActive } from "./navItems";
import { NavIcon } from "./NavIcon";

/** Five persistent destinations with short, localised labels and a clear active state. */
export function BottomNav() {
  const pathname = usePathname();
  const t = useT();
  return (
    <nav
      aria-label={t("navPrimary")}
      className="no-print min-[1033px]:hidden fixed bottom-0 inset-x-0 z-40 bg-elevated border-t border-line safe-bottom"
    >
      <ul className="grid grid-cols-5 h-16">
        {MOBILE_NAV_ITEMS.map((item) => {
          const active = isTabActive(pathname, item.href);
          return (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? "bg-accent-soft text-accent-text" : "text-secondary"
                }`}
              >
                <NavIcon icon={item.icon} />
                <span className="text-base font-semibold leading-none">{t(item.href === "/dictionary" ? "navDictionaryShort" : item.href === "/library" ? "navLibraryShort" : item.href === "/children" ? "navStoriesShort" : item.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
