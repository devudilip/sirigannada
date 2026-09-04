import type { MetadataRoute } from "next";
import { readBooksManifest } from "./readManifest";

/** Canonical origin. Keep in sync with `metadataBase` in src/app/layout.tsx. */
export const SITE_URL = "https://www.sirigannada.in";

type StaticEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const STATIC_ENTRIES: readonly StaticEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/dictionary", changeFrequency: "weekly", priority: 0.9 },
  { path: "/library", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/credits", changeFrequency: "yearly", priority: 0.4 },
  { path: "/tools", changeFrequency: "yearly", priority: 0.6 },
  { path: "/proverbs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tools/transliterate", changeFrequency: "yearly", priority: 0.5 },
  { path: "/tools/numbers", changeFrequency: "yearly", priority: 0.5 },
  { path: "/tools/convert", changeFrequency: "yearly", priority: 0.5 },
  { path: "/tools/text-health", changeFrequency: "yearly", priority: 0.5 },
  { path: "/learn", changeFrequency: "yearly", priority: 0.6 },
  { path: "/learn/alphabet", changeFrequency: "yearly", priority: 0.6 },
  { path: "/learn/padabandha", changeFrequency: "monthly", priority: 0.6 },
];

/**
 * Every indexable URL: the fixed routes plus one page per book in the committed
 * manifest. Read at build time — `next build` with output: "export" freezes this
 * into out/sitemap.xml.
 */
export function siteSitemapEntries(): MetadataRoute.Sitemap {
  const manifest = readBooksManifest();
  const lastModified = manifest.builtAt || undefined;

  return [
    ...STATIC_ENTRIES.map((entry) => ({
      url: `${SITE_URL}${entry.path === "/" ? "" : entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...manifest.books.map((book) => ({
      url: `${SITE_URL}/library/${book.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
