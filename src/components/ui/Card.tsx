import type { HTMLAttributes } from "react";

/** Flat bordered surface: 1 px rule, surface fill, square corners. No shadow. */
export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-elevated border border-line ${className}`} {...rest} />;
}

/** Skeleton block for loading states. Pass width/height via className. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse bg-paper-edge ${className}`} />;
}
