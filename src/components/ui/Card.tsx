import type { HTMLAttributes } from "react";

/** Flat bordered surface. Use for a self-contained unit (a dictionary entry, a book). */
export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-elevated border border-line rounded-lg ${className}`} {...rest} />;
}

/** Skeleton block for loading states. Pass width/height via className. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-paper-edge ${className}`} />;
}
