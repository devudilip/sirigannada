import type { Metadata } from "next";
import { BookCredits } from "@/features/picturebooks/components/BookCredits";
import { readPicturebooksManifest } from "@/features/picturebooks/lib/readManifest";
import { strings } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  const params = readPicturebooksManifest().books.map((b) => ({
    slug: b.slug,
  }));
  return params.length > 0 ? params : [{ slug: "none" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = readPicturebooksManifest().books.find((b) => b.slug === slug);
  return {
    title: `${book?.title ?? strings.picturebooksTitle.kn} · ${strings.picturebooksAttributionTitle.kn}`,
    alternates: { canonical: `/picturebooks/${slug}/credits` },
    robots: { index: false },
  };
}

export default async function PicturebookCreditsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <BookCredits slug={slug} />
    </div>
  );
}
