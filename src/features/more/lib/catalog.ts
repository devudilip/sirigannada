import type { StringKey } from "@/lib/i18n";

export interface MoreEntry {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}

/** ನನ್ನದು · Mine: what the reader has saved or is learning. */
export const MINE: readonly MoreEntry[] = [
  { href: "/collections", titleKey: "collectionsTitle", subKey: "collectionsSub" },
  { href: "/proverbs", titleKey: "proverbsTitle", subKey: "proverbsSub" },
  { href: "/learn", titleKey: "learnTitle", subKey: "learnSub" },
];

/** ಉಪಕರಣಗಳು · Tools: utilities, ending with the offline manager. */
export const UTILITIES: readonly MoreEntry[] = [
  { href: "/tools/transliterate", titleKey: "transliterateTitle", subKey: "transliterateSub" },
  { href: "/tools/numbers", titleKey: "numbersTitle", subKey: "numbersSub" },
  { href: "/tools/convert", titleKey: "convertTitle", subKey: "convertSub" },
  { href: "/tools/text-health", titleKey: "textHealthTitle", subKey: "textHealthSub" },
  { href: "/tools/offline", titleKey: "offlineManagerTitle", subKey: "offlineManagerSub" },
];
