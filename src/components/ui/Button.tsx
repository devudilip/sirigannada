import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Flat, square, flush-left. Primary = coral fill; secondary = 1 px ink rule; ghost = coral text.
 * Labels sit at the left edge of the button (brand rule); pass `className="justify-center"` only
 * for icon-only or symmetric controls.
 */
const base =
  "inline-flex items-center justify-start gap-2 font-semibold transition-colors duration-150 select-none disabled:opacity-50 disabled:pointer-events-none";
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest} />;
}

/** Square icon-only button, 44px touch target. Always pass aria-label. */
export function IconButton({ className = "", type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center size-11 text-ink hover:bg-elevated active:bg-paper-edge transition-colors duration-150 disabled:opacity-40 ${className}`}
      {...rest}
    />
  );
}
