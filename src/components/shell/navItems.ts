import type { StringKey } from "@/lib/i18n";

export interface NavItem {
  href: string;
  labelKey: StringKey;
  icon: "home" | "search" | "book" | "info";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "navHome", icon: "home" },
  { href: "/dictionary", labelKey: "navDictionary", icon: "search" },
  { href: "/library", labelKey: "navLibrary", icon: "book" },
  { href: "/about", labelKey: "navAbout", icon: "info" },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
