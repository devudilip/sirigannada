import type { StringKey } from "@/lib/i18n";

export interface GameEntry {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}

/** Published games. Add a row here when a new game ships. */
export const GAMES: readonly GameEntry[] = [
  { href: "/games/word", titleKey: "wordGameTitle", subKey: "gamesWordSub" },
  { href: "/games/padabandha", titleKey: "padabandhaTitle", subKey: "padabandhaSub" },
];
