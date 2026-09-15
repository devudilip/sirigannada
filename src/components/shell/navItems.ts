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
  { href: "/picturebooks", labelKey: "navPicturebooks", icon: "book", desktopOnly: true },
  { href: "/proverbs", labelKey: "proverbsTitle", icon: "info", desktopOnly: true },
  { href: "/games", labelKey: "navGames", icon: "games", desktopOnly: true },
  { href: "/games", labelKey: "navGamesShort", icon: "games", mobileOnly: true },
  { href: "/learn", labelKey: "learnTitle", icon: "info", desktopOnly: true },
  { href: "/tools", labelKey: "navTools", icon: "info", desktopOnly: true },
  { href: "/more", labelKey: "navMore", icon: "more", mobileOnly: true },
];

export const MOBILE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.desktopOnly);
export const DESKTOP_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.mobileOnly);

/** Desktop header: each section has its own link, so only an exact section matches. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Phone tab bar: five tabs stand for everything, so the Library tab also covers the story
 * shelves and More covers the sections it lists.
 */
export function isTabActive(pathname: string, href: string): boolean {
  if (href === "/library") return ["/library", "/stories", "/picturebooks"].some((p) => isActive(pathname, p));
  if (href === "/more") return ["/more", "/collections", "/tools", "/about", "/credits", "/contact", "/learn", "/proverbs"].some((p) => isActive(pathname, p));
  return isActive(pathname, href);
}
