import type { StringKey } from "@/lib/i18n";

export interface NavItem {
  href: string;
  /** Kannada label (always shown first). */
  labelKey: StringKey;
  icon: "home" | "search" | "book" | "stories" | "games" | "more" | "info";
  /** Shown in the desktop header only; the five-slot bottom bar stays legible at 320 px. */
  desktopOnly?: boolean;
  /** Shown in the bottom bar only. */
  mobileOnly?: boolean;
}

/**
 * Five-tab phone shell: ಮನೆ · ಹುಡುಕು · ಮಕ್ಕಳ ಕಥೆ · ಗ್ರಂಥಾಲಯ · ಇನ್ನಷ್ಟು. Owner decision 2026-09-26:
 * children's stories were hard to find behind More, so they take the middle tab, the library moves
 * one slot right, and ಆಟ moves into More (the home page's ಇಂದು block still opens the daily games).
 * Search points at the dictionary. Desktop lists the sections directly instead of More.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "navHome", icon: "home", mobileOnly: true },
  { href: "/dictionary", labelKey: "navDictionary", icon: "search", desktopOnly: true },
  { href: "/dictionary", labelKey: "navSearch", icon: "search", mobileOnly: true },
  { href: "/children", labelKey: "navChildrenShort", icon: "stories", mobileOnly: true },
  { href: "/library", labelKey: "navLibrary", icon: "book" },
  { href: "/children", labelKey: "navChildren", icon: "book", desktopOnly: true },
  { href: "/proverbs", labelKey: "proverbsTitle", icon: "info", desktopOnly: true },
  { href: "/games", labelKey: "navGames", icon: "games", desktopOnly: true },
  { href: "/learn", labelKey: "learnTitle", icon: "info", desktopOnly: true },
  { href: "/tools", labelKey: "navTools", icon: "info", desktopOnly: true },
  { href: "/more", labelKey: "navMore", icon: "more", mobileOnly: true },
];

export const MOBILE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.desktopOnly);
export const DESKTOP_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.mobileOnly);

/**
 * Desktop header: each section has its own link, so only an exact section matches. The picture-book
 * reader lives at /picturebooks/<slug> but is reached through ಮಕ್ಕಳ ಕಥೆಗಳು, so it lights that link.
 */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/children" && isActive(pathname, "/picturebooks")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Phone tab bar: More covers the sections it lists (games included); the children's tab covers the
 * hub, its story pages and the picture-book reader, so a reader is never told they are "in the
 * library" while looking at picture books.
 */
export function isTabActive(pathname: string, href: string): boolean {
  if (href === "/more") return ["/more", "/games", "/collections", "/tools", "/about", "/credits", "/contact", "/learn", "/proverbs"].some((p) => isActive(pathname, p));
  return isActive(pathname, href);
}
