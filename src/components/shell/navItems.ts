import type { StringKey } from "@/lib/i18n";

export interface NavItem {
  href: string;
  labelKey: StringKey;
  icon: "home" | "search" | "book" | "games" | "tools" | "info";
  /** Shown in the desktop header only; the five-slot bottom bar stays legible at 320 px. */
  desktopOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "navHome", icon: "home" },
  { href: "/dictionary", labelKey: "navDictionary", icon: "search" },
  { href: "/library", labelKey: "navLibrary", icon: "book" },
  { href: "/games", labelKey: "navGames", icon: "games" },
  { href: "/tools", labelKey: "navTools", icon: "tools" },
  { href: "/about", labelKey: "navAbout", icon: "info", desktopOnly: true },
];

/** Items for the mobile bottom bar (About is reachable from Tools and the desktop header). */
export const MOBILE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.desktopOnly);

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
