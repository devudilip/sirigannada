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
  { href: "/tools/text-health", titleKey: "textHealthTitle", subKey: "textHealthSub" },
  { href: "/tools/offline", titleKey: "offlineManagerTitle", subKey: "offlineManagerSub" },
];

/**
 * Home already has a proverbs section, collections is reached from save buttons, and offline
 * storage is a settings-style page, and About sits in the header — all omitted from the home strip.
 */
export const HOME_TOOLS: readonly ToolEntry[] = TOOLS.filter(
  (tool) => !["/proverbs", "/collections", "/tools/offline", "/about"].includes(tool.href),
);
