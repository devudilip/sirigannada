"use client";

import { useId, type InputHTMLAttributes } from "react";
import { SearchIcon, CloseIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";

interface SearchBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  value: string;
  onChange: (value: string) => void;
  size?: "md" | "lg";
}

export function SearchBox({ value, onChange, size = "md", className = "", ...rest }: SearchBoxProps) {
  const t = useT();
  const id = useId();
  const h = size === "lg" ? "h-14 text-lg" : "h-12 text-base";
  return (
    <div className={`relative flex items-center ${className}`}>
      <SearchIcon size={20} className="absolute left-4 text-muted pointer-events-none" />
      <input
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className={`w-full ${h} pl-12 pr-14 rounded-lg bg-elevated border border-line focus:border-accent placeholder:text-muted text-ink font-sans outline-none transition-colors duration-150 [&::-webkit-search-cancel-button]:hidden`}
        {...rest}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("clearSearch")}
          className="absolute right-1 inline-flex items-center justify-center size-11 rounded-md text-muted hover:text-ink hover:bg-paper"
        >
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  );
}
