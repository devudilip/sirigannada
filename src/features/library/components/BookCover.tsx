"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProviders";
import type { BookCover as BookCoverData } from "@/lib/types";
import { coverUrl } from "../lib/coverUrl";

/**
 * A cover photograph in a fixed 3:4 frame. The files under public/data/covers/ are already
 * stored as a warm monochrome (duotone) version of the source photo, so a dozen unrelated
 * photographs read as one shelf without any blend layers here; a photo only needs its frame.
 *
 * `children` paint on top of the photo — the home strip puts its title band there.
 */
export function BookCover({
  cover,
  className = "",
  children,
}: {
  cover: BookCoverData;
  className?: string;
  children?: ReactNode;
}) {
  const { locale } = useApp();
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-md bg-elevated ${className}`}>
      <img
        src={coverUrl(cover.file)}
        alt={cover.alt[locale]}
        width={480}
        height={640}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {children}
    </span>
  );
}
