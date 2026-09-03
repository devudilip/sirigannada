"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { analyseTextHealth } from "../lib/analyseTextHealth";
import { applyFinding } from "../lib/applyFinding";
import type { TextHealthCopy, TextHealthFinding } from "../types";
import { TextHealthFindingCard } from "./TextHealthFindingCard";

export function TextHealthChecker() {
  const t = useT();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const deferredInput = useDeferredValue(input);
  const report = useMemo(() => analyseTextHealth(deferredInput), [deferredInput]);
  const copy: TextHealthCopy = {
    inputLabel: t("textHealthInput"),
    inputPlaceholder: t("textHealthPlaceholder"),
    privacyNote: t("textHealthPrivacy"),
    emptyHint: t("textHealthEmpty"),
    healthy: t("textHealthHealthy"),
    findingsSummary: (vars) => t("textHealthFindings", vars),
    truncatedNotice: t("textHealthTruncated"),
    findingLocation: (vars) => t("textHealthLocation", vars),
    suggestionLabel: t("textHealthSuggestion"),
    applySuggestion: t("textHealthApply"),
    copyText: t("textHealthCopy"),
    copied: t("copied"),
    categories: {
      normalization: t("textHealthCategoryNormalization"),
      legacy: t("textHealthCategoryLegacy"),
      invisible: t("textHealthCategoryInvisible"),
      spacing: t("textHealthCategorySpacing"),
      punctuation: t("textHealthCategoryPunctuation"),
      encoding: t("textHealthCategoryEncoding"),
    },
    explanations: {
      nonNfc: () => t("textHealthNonNfc"),
      legacyNudi: () => t("textHealthLegacyNudi"),
      mixedLatin: () => t("textHealthMixedLatin"),
      latinMatraLeak: () => t("textHealthLatinMatraLeak"),
      invisibleCharacter: (vars) => t("textHealthInvisibleCharacter", vars),
      repeatedWhitespace: () => t("textHealthRepeatedWhitespace"),
      extraBlankLines: () => t("textHealthExtraBlankLines"),
      repeatedPunctuation: () => t("textHealthRepeatedPunctuation"),
      encodingMarker: () => t("textHealthEncodingMarker"),
      legacyConversionDamage: () => t("textHealthLegacyConversionDamage"),
      brokenLineWrap: () => t("textHealthBrokenLineWrap"),
    },
  };

  function updateInput(value: string): void {
    setInput(value);
    setCopied(false);
  }

  function applySuggestion(finding: TextHealthFinding): void {
    updateInput(applyFinding(input, finding));
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function copyReviewedText(): Promise<void> {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-base font-medium text-ink">
        {copy.inputLabel}
        <textarea
          ref={inputRef}
          className="min-h-48 resize-y rounded-md border border-line-strong bg-elevated p-4 font-serif text-lg text-ink leading-kannada"
          lang="kn"
          value={input}
          placeholder={copy.inputPlaceholder}
          onChange={(event) => updateInput(event.target.value)}
          autoFocus
          spellCheck={false}
        />
      </label>
      <p className="text-sm text-muted">{copy.privacyNote}</p>

      {!input ? (
        <p className="rounded-md border border-line bg-paper p-4 text-base text-secondary">
          {copy.emptyHint}
        </p>
      ) : report.findings.length === 0 ? (
        <p className="rounded-md border border-line bg-paper p-4 text-base text-ink" role="status">
          {copy.healthy}
        </p>
      ) : (
        <section aria-labelledby="text-health-results">
          <h2 id="text-health-results" className="text-lg font-medium text-ink" aria-live="polite">
            {copy.findingsSummary({ count: report.findings.length })}
          </h2>
          {report.truncated && <p className="mt-2 text-base text-secondary">{copy.truncatedNotice}</p>}
          <ul className="mt-3 rounded-lg border border-line bg-elevated px-4">
            {report.findings.map((finding) => (
              <TextHealthFindingCard
                key={finding.id}
                finding={finding}
                copy={copy}
                onApply={applySuggestion}
              />
            ))}
          </ul>
        </section>
      )}

      <Button variant="secondary" onClick={copyReviewedText} disabled={!input}>
        {copied ? copy.copied : copy.copyText}
      </Button>
    </div>
  );
}
