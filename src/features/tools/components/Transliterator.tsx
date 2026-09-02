"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";
import { isoToKannada, kannadaToIso } from "../lib/transliterate";
import type { TransliterationDirection } from "../types";

const DIRECTIONS: Array<{
  value: TransliterationDirection;
  label: StringKey;
}> = [
  { value: "latin-to-kannada", label: "latinToKannada" },
  { value: "kannada-to-latin", label: "kannadaToLatin" },
];

export function Transliterator() {
  const t = useT();
  const [direction, setDirection] =
    useState<TransliterationDirection>("latin-to-kannada");
  const [input, setInput] = useState("");
  const output = useMemo(
    () => direction === "latin-to-kannada"
      ? isoToKannada(input)
      : kannadaToIso(input),
    [direction, input],
  );

  function changeDirection(next: TransliterationDirection) {
    if (next === direction) return;
    setInput(output);
    setDirection(next);
  }

  const isLatinInput = direction === "latin-to-kannada";

  return (
    <div className="flex flex-col gap-5">
      <div
        className="grid grid-cols-2 rounded-md border border-line bg-elevated p-1"
        role="group"
        aria-label={t("transliterateTitle")}
      >
        {DIRECTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`min-h-11 rounded-sm px-3 text-base font-medium ${
              direction === value
                ? "bg-accent text-on-accent"
                : "text-secondary"
            }`}
            aria-pressed={direction === value}
            onClick={() => changeDirection(value)}
          >
            {t(label)}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2 text-base font-medium text-ink">
        {t("transliterateInput")}
        <textarea
          className="min-h-36 resize-y rounded-md border border-line-strong bg-elevated p-4 font-serif text-lg text-ink"
          lang={isLatinInput ? "en" : "kn"}
          value={input}
          placeholder={t(isLatinInput ? "latinInputPlaceholder" : "kannadaInputPlaceholder")}
          onChange={(event) => setInput(event.target.value)}
          autoFocus
        />
      </label>

      <label className="flex flex-col gap-2 text-base font-medium text-ink">
        {t("transliterateOutput")}
        <textarea
          className="min-h-36 resize-y rounded-md border border-line bg-paper p-4 font-serif text-lg text-ink"
          lang={isLatinInput ? "kn" : "en"}
          value={output}
          readOnly
          aria-live="polite"
        />
      </label>

      <p className="text-sm text-muted">{t("isoNote")}</p>
    </div>
  );
}
