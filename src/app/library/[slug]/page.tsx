import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import type { BooksManifest } from "@/lib/types";
import { Reader } from "@/features/reader/components/Reader";

export const dynamicParams = false;

/** Static export: one HTML page per book, from the manifest built by `npm run data:books`. */
function readManifest(): BooksManifest {
  try {
    const file = path.join(process.cwd(), "public", "data", "books", "manifest.json");
    return JSON.parse(fs.readFileSync(file, "utf8")) as BooksManifest;
  } catch {
    return { books: [], builtAt: "" };
  }
}

export function generateStaticParams() {
  return readManifest().books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = readManifest().books.find((b) => b.slug === slug);
  if (!book) return { title: "ಗ್ರಂಥಾಲಯ" };
  return {
    title: book.title,
    description: book.description,
    openGraph: { title: `${book.title} · ${book.author}`, description: book.description },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Reader slug={slug} />;
}
