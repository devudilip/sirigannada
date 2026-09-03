import type { StringKey } from "@/lib/i18n";

export interface ToolEntry {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}

export const TOOLS: readonly ToolEntry[] = [
  { href: "/tools/transliterate", titleKey: "transliterateTitle", subKey: "transliterateSub" },
  { href: "/tools/numbers", titleKey: "numbersTitle", subKey: "numbersSub" },
  { href: "/tools/convert", titleKey: "convertTitle", subKey: "convertSub" },
  { href: "/learn/alphabet", titleKey: "alphabetTitle", subKey: "alphabetSub" },
  { href: "/proverbs", titleKey: "proverbsTitle", subKey: "proverbsSub" },
];

/** Home already has a proverbs section, so the tools strip omits that row. */
export const HOME_TOOLS: readonly ToolEntry[] = TOOLS.filter((tool) => tool.href !== "/proverbs");
