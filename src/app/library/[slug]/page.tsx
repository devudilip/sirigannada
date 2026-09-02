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
    openGraph: {
      type: "website",
      siteName: "Sirigannada",
      locale: "kn_IN",
      title: `${book.title} · ${book.author}`,
      description: book.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "ಸಿರಿಗನ್ನಡ · Sirigannada" }],
    },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Reader slug={slug} />;
}
