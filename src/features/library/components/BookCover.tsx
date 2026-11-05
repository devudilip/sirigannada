"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProviders";
import type { BookCover as BookCoverData } from "@/lib/types";
import { coverUrl } from "../lib/coverUrl";

/** Real, credited cover photographs in neutral monochrome. The legacy files contain a
 * warm tint; grayscale removes that tint without fabricating lost source colours.
 * Layout controls the frame and titles remain outside the photograph.
 */
export function BookCover({
  cover,
  className = "",
  children,
  natural,
}: {
  cover: BookCoverData;
  className?: string;
  children?: ReactNode;
  natural?: boolean;
}) {
  const { locale } = useApp();
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-md bg-elevated ${className}`}
    >
      <img
        src={coverUrl(cover.file)}
        alt={cover.alt[locale]}
        width={480}
        height={640}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover object-center ${(natural ?? cover.file === "aluru-karnataka-gatavaibhava.webp") ? "" : "grayscale"}`}
      />
      {children}
    </span>
  );
}
