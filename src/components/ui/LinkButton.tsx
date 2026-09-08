import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * A `next/link` dressed as a `Button` for navigation actions (Play, Resume). Same variants and
 * sizes as `Button`; the class strings below are copied verbatim — keep in sync with Button.tsx.
 */
const base =
  "inline-flex items-center justify-start gap-2 font-semibold transition-colors duration-150 select-none";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong active:bg-accent-strong",
  secondary: "bg-transparent text-ink border border-ink hover:bg-elevated active:bg-paper-edge",
  ghost: "text-accent-strong hover:bg-elevated active:bg-paper-edge",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-13 px-5 text-base",
};

export interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function LinkButton({ variant = "primary", size = "md", className = "", ...rest }: LinkButtonProps) {
  return <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest} />;
}
