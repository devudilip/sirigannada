import type { Metadata } from "next";
import { Reader } from "@/features/reader/components/Reader";
import { readBooksManifest } from "@/features/library/lib/readManifest";

export const dynamicParams = false;

export function generateStaticParams() {
  return readBooksManifest().books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = readBooksManifest().books.find((b) => b.slug === slug);
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
