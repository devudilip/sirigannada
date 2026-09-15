import fs from "node:fs";
import path from "node:path";
import type { StoriesManifest } from "@/lib/types";

/** Static export: read the generated stories manifest at build time (for route params). */
export function readStoriesManifest(): StoriesManifest {
  try {
    const file = path.join(process.cwd(), "public", "data", "stories", "manifest.json");
    return JSON.parse(fs.readFileSync(file, "utf8")) as StoriesManifest;
  } catch {
    return { stories: [], pending: [], builtAt: "" };
  }
}
