"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProviders";
import type { BookCover as BookCoverData } from "@/lib/types";
import { coverUrl } from "../lib/coverUrl";

/** A credited original photograph, without a colour filter. */
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
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {children}
    </span>
  );
}
