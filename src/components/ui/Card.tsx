import type { HTMLAttributes } from "react";

/** Elevated card: white fill, 1 px rule, rounded, one soft shadow. */
export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-elevated border border-line rounded-lg shadow-elevated ${className}`} {...rest} />;
}

/** Skeleton block for loading states. Pass width/height via className. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-paper-edge ${className}`} />;
}
