import fs from "node:fs";
import path from "node:path";
import type { BooksManifest } from "@/lib/types";

/** Static export: read the committed books manifest at build time. */
export function readBooksManifest(): BooksManifest {
  try {
    const file = path.join(process.cwd(), "public", "data", "books", "manifest.json");
    return JSON.parse(fs.readFileSync(file, "utf8")) as BooksManifest;
  } catch {
    return { books: [], builtAt: "" };
  }
}
