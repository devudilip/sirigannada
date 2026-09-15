import type { Metadata } from "next";
import { BookReader } from "@/features/picturebooks/components/BookReader";
import { readPicturebooksManifest } from "@/features/picturebooks/lib/readManifest";

export const dynamicParams = false;

export function generateStaticParams() {
  return readPicturebooksManifest().books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = readPicturebooksManifest().books.find((b) => b.slug === slug);
  if (!book) return { title: "ಚಿತ್ರಪುಸ್ತಕಗಳು", alternates: { canonical: `/picturebooks/${slug}` } };
  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/picturebooks/${slug}` },
    openGraph: {
      type: "website",
      siteName: "Sirigannada",
      locale: "kn_IN",
      title: book.title,
      description: book.description,
      images: [{ url: book.cover.src, width: book.cover.width, height: book.cover.height, alt: book.title }],
    },
  };
}

export default async function PicturebookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BookReader slug={slug} />;
}
