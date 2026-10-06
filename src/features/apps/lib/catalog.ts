import type { StringKey } from "@/lib/i18n";

export interface SiblingApp {
  id: "kcet";
  titleKey: StringKey;
  subKey: StringKey;
  /** Absolute origin of the sibling site: its own subdomain, never a path on this site. */
  href: string;
  /** Interface language of the sibling, for `lang` on its title. */
  lang: "kn" | "en";
}

/**
 * Products published under the Sirigannada name on their own subdomains. Each is a separate
 * origin: its own repo, service worker, storage, store listing, and privacy page. A feature that
 * strengthens the word ↔ book ↔ proverb chain belongs in this site as a route, not here.
 */
export const SIBLING_APPS: readonly SiblingApp[] = [
  { id: "kcet", titleKey: "appsKcetTitle", subKey: "appsKcetSub", href: "https://pu.sirigannada.in/", lang: "en" },
];
