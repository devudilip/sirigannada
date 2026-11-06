"use client";

import { dailySelection } from "@/lib/dailySelection";
import { levelBucket } from "../lib/filter";
import { isRead } from "@/lib/readingStatus";
import { useReadingStatus } from "@/lib/useReadingStatus";
import { readProgress } from "../lib/progress";
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
  age?: string;
}

/** A stable daily mix of illustrated stories, reading levels and narrated picture books. */
export function PicturebookCoverStrip({
  limit = 6,
  leads,
}: {
  limit?: number;
  leads?: ShelfLead[];
}) {
  const { locale, t } = useApp();
  const states = useReadingStatus();
  const manifest = usePicturebooksManifest();
  if (!manifest) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: limit }, (_, i) => (
          <Skeleton
            key={i}
            className={`aspect-[4/5] rounded-lg ${i >= 3 ? "min-[1033px]:block" : ""}`}
          />
        ))}
      </div>
    );
  }
  const lead = limit > 0 ? dailySelection(leads ?? [], (story) => story.href, 1, new Date())[0] : undefined;
  const books = dailySelection(manifest.books.filter((book) => { const saved = readProgress(book.slug); return !isRead(`picturebook:${book.slug}`, states, Boolean(saved && saved.page >= saved.pageCount - 1)); }), (book) => book.slug, Math.max(0, lead ? limit - 1 : limit), new Date(), (book) => book.audio ? "audio" : levelBucket(book.level));
  if (books.length === 0 && !lead) return null;
  const offset = lead ? 1 : 0;
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {lead && (
        <li>
          <Link href={lead.href} className="group block">
            <span className="relative block aspect-[5/5] overflow-hidden rounded-md bg-elevated border border-line transition-colors group-hover:border-accent-strong">
              <StoryArt
                image={lead.image}
                panel={0}
                alt={lead.alt}
                className="absolute inset-y-0 left-1/2 h-full aspect-square -translate-x-1/2 rounded-none"
              />
            </span>
            <span
              className="mt-1.5 block break-words font-serif text-base font-semibold leading-snug text-ink"
              lang="kn"
            >
              {lead.title}
            </span>
            {lead.age && <span className="block text-base text-secondary">{t("childrenAge", { age: lead.age })}</span>}
          </Link>
        </li>
      )}
      {books.map((book, i) => (
        <li
          key={book.slug}
          className={i + offset >= 3 ? "min-[1033px]:block" : ""}
        >
          <Link href={`/picturebooks/${book.slug}`} className="group block">
            <span className="relative block aspect-[5/5] overflow-hidden rounded-md bg-elevated border border-line transition-colors group-hover:border-accent-strong">
              {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
              <img
                src={book.cover.src}
                alt=""
                className="block size-full object-cover"
                loading="lazy"
              />
              {book.audio && (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-accent-strong text-on-accent"
                >
                  <VolumeIcon size={13} />
                </span>
              )}
            </span>
            <span
              className="mt-1.5 block break-words font-serif text-base font-semibold leading-snug text-ink"
              lang={locale}
            >
              {bookTitle(book, locale)}
            </span>
            <span className="block text-base text-secondary">{book.audio ? t("homeNarrated") : t("picturebooksLevel", { n: book.level })}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
