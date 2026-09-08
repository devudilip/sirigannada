import type { StringKey } from "@/lib/i18n";

export interface NavItem {
  href: string;
  /** Kannada label (always shown first). */
  labelKey: StringKey;
  icon: "home" | "search" | "book" | "games" | "more" | "info";
  /** Shown in the desktop header only; the five-slot bottom bar stays legible at 320 px. */
  desktopOnly?: boolean;
  /** Shown in the bottom bar only. */
  mobileOnly?: boolean;
}

/**
 * Five-tab shell (UX-06): ಮನೆ · ಹುಡುಕು · ಗ್ರಂಥಾಲಯ · ಆಟ · ಇನ್ನಷ್ಟು. Search points at the dictionary
 * until the unified /search index (F-01) lands. Desktop lists the sections directly instead of More.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "navHome", icon: "home", mobileOnly: true },
  { href: "/dictionary", labelKey: "navDictionary", icon: "search", desktopOnly: true },
  { href: "/dictionary", labelKey: "navSearch", icon: "search", mobileOnly: true },
  { href: "/library", labelKey: "navLibrary", icon: "book" },
  { href: "/proverbs", labelKey: "proverbsTitle", icon: "info", desktopOnly: true },
  { href: "/games", labelKey: "navGames", icon: "games", desktopOnly: true },
  { href: "/games", labelKey: "navGamesShort", icon: "games", mobileOnly: true },
  { href: "/learn", labelKey: "learnTitle", icon: "info", desktopOnly: true },
  { href: "/tools", labelKey: "navTools", icon: "info", desktopOnly: true },
  { href: "/more", labelKey: "navMore", icon: "more", mobileOnly: true },
];

export const MOBILE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.desktopOnly);
export const DESKTOP_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.mobileOnly);

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/more") return pathname === "/more" || ["/collections", "/tools", "/about", "/credits", "/learn", "/proverbs"].some((p) => pathname.startsWith(p));
  return pathname.startsWith(href);
}
