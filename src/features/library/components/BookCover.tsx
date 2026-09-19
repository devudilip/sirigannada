"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProviders";
import type { BookCover as BookCoverData } from "@/lib/types";
import { coverUrl } from "../lib/coverUrl";

/**
 * A cover photograph in a fixed 3:4 frame, tinted to the brand duotone so a dozen unrelated
 * photographs read as one shelf.
 *
 * The recipe is two flat layers over a desaturated photo, all in tokens:
 *   1. `cover-photo` strips the photo's own colour (grayscale + a touch of contrast);
 *   2. a `multiply` layer in the ivory highlight tone pulls the whites to paper;
 *   3. a `screen` layer in the deep kumkum shadow tone lifts the blacks off pure black.
 * `isolate` keeps the blending inside the frame. Both tones flip with the theme.
 *
 * `children` paint on top of the blend layers — the home strip puts its title band there.
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
    <span className={`relative isolate block shrink-0 overflow-hidden rounded-md bg-elevated ${className}`}>
      <img
        src={coverUrl(cover.file)}
        alt={cover.alt[locale]}
        width={480}
        height={640}
        loading="lazy"
        decoding="async"
        className="cover-photo absolute inset-0 h-full w-full object-cover"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-cover-highlight mix-blend-multiply" />
      <span aria-hidden="true" className="absolute inset-0 bg-cover-shadow mix-blend-screen" />
      {children}
    </span>
  );
}
