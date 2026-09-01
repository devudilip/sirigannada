import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 select-none disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong active:bg-accent-strong",
  secondary: "bg-elevated text-ink border border-line hover:border-line-strong active:bg-paper",
  ghost: "text-ink hover:bg-paper active:bg-paper-edge",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-5 text-lg",
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
      className={`inline-flex items-center justify-center size-11 rounded-md text-ink hover:bg-paper active:bg-paper-edge transition-colors duration-150 disabled:opacity-40 ${className}`}
      {...rest}
    />
  );
}
