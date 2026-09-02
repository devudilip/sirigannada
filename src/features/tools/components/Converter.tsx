"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { CheckIcon, CopyIcon } from "@/components/icons";
import type { StringKey } from "@/lib/i18n";
import { nudiToUnicode, unicodeToNudi } from "../lib/convert";
import type { ConvertDirection } from "../types";

const DIRECTIONS: Array<{ value: ConvertDirection; label: StringKey }> = [
  { value: "nudi-to-unicode", label: "nudiToUnicode" },
  { value: "unicode-to-nudi", label: "unicodeToNudi" },
];

export function Converter() {
  const t = useT();
  const [direction, setDirection] = useState<ConvertDirection>("nudi-to-unicode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const toUnicode = direction === "nudi-to-unicode";
  const output = useMemo(
    () => (toUnicode ? nudiToUnicode(input) : unicodeToNudi(input)),
    [toUnicode, input],
  );

  function changeDirection(next: ConvertDirection) {
    if (next === direction) return;
    setInput(output);
    setDirection(next);
    setCopied(false);
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="grid grid-cols-2 rounded-md border border-line bg-elevated p-1"
        role="group"
        aria-label={t("convertTitle")}
      >
        {DIRECTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`min-h-11 rounded-sm px-3 text-base font-medium ${
              direction === value ? "bg-accent text-on-accent" : "text-secondary"
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
          className="min-h-36 resize-y rounded-md border border-line-strong bg-elevated p-4 font-sans text-lg text-ink"
          lang={toUnicode ? "en" : "kn"}
          value={input}
          placeholder={t(toUnicode ? "nudiInputPlaceholder" : "kannadaInputPlaceholder")}
          onChange={(event) => {
            setInput(event.target.value);
            setCopied(false);
          }}
          autoFocus
          spellCheck={false}
        />
      </label>

      <label className="flex flex-col gap-2 text-base font-medium text-ink">
        {t("convertOutput")}
        <textarea
          className="min-h-36 resize-y rounded-md border border-line bg-paper p-4 font-serif text-lg text-ink leading-kannada"
          lang={toUnicode ? "kn" : "en"}
          value={output}
          readOnly
          aria-live="polite"
        />
      </label>

      <Button variant="secondary" onClick={copyOutput} disabled={!output} aria-label={t("copyOutput")}>
        {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        {copied ? t("copied") : t("copyOutput")}
      </Button>

      <p className="text-sm text-muted">{t("convertNote")}</p>
    </div>
  );
}
