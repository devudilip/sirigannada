import fs from "node:fs";
import path from "node:path";
import type { PictureBooksManifest } from "@/lib/types";

/** Static export: read the generated picture-books manifest at build time (for route params). */
export function readPicturebooksManifest(): PictureBooksManifest {
  try {
    const file = path.join(process.cwd(), "public", "data", "picturebooks", "manifest.json");
    return JSON.parse(fs.readFileSync(file, "utf8")) as PictureBooksManifest;
  } catch {
    return { books: [], builtAt: "" };
  }
}
