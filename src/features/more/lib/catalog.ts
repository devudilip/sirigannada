import type { StringKey } from "@/lib/i18n";

export interface MoreEntry {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}

/**
 * ನನ್ನದು · Mine: what the reader has saved, plays or is learning. ಮಕ್ಕಳ ಕಥೆಗಳು has its own phone
 * tab, so it is not repeated here; ಆಟಗಳು lives here since it left the tab bar (2026-09-26).
 */
export const MINE: readonly MoreEntry[] = [
  { href: "/collections", titleKey: "collectionsTitle", subKey: "collectionsSub" },
];

export const EXPLORE: readonly MoreEntry[] = [
  { href: "/learn", titleKey: "learnTitle", subKey: "learnSub" },
  { href: "/games", titleKey: "gamesTitle", subKey: "gamesSub" },
  { href: "/proverbs", titleKey: "proverbsTitle", subKey: "proverbsSub" },
];

export const UTILITIES: readonly MoreEntry[] = [
  { href: "/tools", titleKey: "navTools", subKey: "toolsSub" },
  { href: "/search", titleKey: "corpusSearchTitle", subKey: "corpusSearchSub" },
];
