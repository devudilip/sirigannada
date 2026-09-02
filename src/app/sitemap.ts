import type { MetadataRoute } from "next";
import { siteSitemapEntries } from "@/features/library/lib/siteUrls";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteSitemapEntries();
}
