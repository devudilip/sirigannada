"use client";

import Link from "next/link";
import { VolumeIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { StoryArt } from "@/features/children/components/StoryArt";
import { bookTitle } from "../lib/display";
import { usePicturebooksManifest } from "../lib/manifest";

/** A non-picture-book tile shown first: the hub's illustrated story, drawn from its storyboard. */
export interface ShelfLead {
  href: string;
  image: string;
  alt: string;
  title: string;
}

/**
 * A row of lifted cover cards (3 on phones, 6 on md+) from the top of the shelf — the shelf's
 * calling card on home and in the library. Each card links into the reader. An optional `lead`
 * story takes the first slot.
 */
export function PicturebookCoverStrip({ limit = 6, lead }: { limit?: number; lead?: ShelfLead }) {
  const { locale } = useApp();
  const manifest = usePicturebooksManifest();
  if (!manifest) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Array.from({ length: limit }, (_, i) => (
          <Skeleton key={i} className={`aspect-[4/5] rounded-lg ${i >= 3 ? "hidden md:block" : ""}`} />
        ))}
      </div>
    );
  }
  const books = manifest.books.slice(0, lead ? limit - 1 : limit);
  if (books.length === 0 && !lead) return null;
  const offset = lead ? 1 : 0;
  return (
    <ul className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {lead && (
        <li>
          <Link href={lead.href} className="group block">
            <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-elevated shadow-lift transition-transform duration-200 group-hover:-translate-y-1 group-active:translate-y-0">
              <StoryArt image={lead.image} panel={0} alt={lead.alt} className="absolute inset-y-0 left-1/2 h-full aspect-square -translate-x-1/2 rounded-none" />
            </span>
            <span className="mt-1.5 block font-serif text-[13px] font-semibold leading-snug text-ink line-clamp-2" lang="kn">
              {lead.title}
            </span>
          </Link>
        </li>
      )}
      {books.map((book, i) => (
        <li key={book.slug} className={i + offset >= 3 ? "hidden md:block" : ""}>
          <Link href={`/picturebooks/${book.slug}`} className="group block">
            <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-elevated shadow-lift transition-transform duration-200 group-hover:-translate-y-1 group-active:translate-y-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
              <img src={book.cover.src} alt="" className="block size-full object-cover" loading="lazy" />
              {book.audio && (
                <span aria-hidden="true" className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-ink/60 text-white">
                  <VolumeIcon size={13} />
                </span>
              )}
            </span>
            <span className="mt-1.5 block font-serif text-[13px] font-semibold leading-snug text-ink line-clamp-2" lang={locale}>
              {bookTitle(book, locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
