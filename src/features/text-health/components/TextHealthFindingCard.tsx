import { Button } from "@/components/ui/Button";
import type { TextHealthCopy, TextHealthFinding } from "../types";

interface TextHealthFindingCardProps {
  finding: TextHealthFinding;
  copy: TextHealthCopy;
  onApply: (finding: TextHealthFinding) => void;
}

export function TextHealthFindingCard({ finding, copy, onApply }: TextHealthFindingCardProps) {
  const location = copy.findingLocation({
    line: finding.location.line,
    column: finding.location.column,
  });
  const visibleExcerpt = makeInvisibleCharactersVisible(finding.excerpt);

  return (
    <li className="flex flex-col gap-3 border-b border-line py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-medium text-ink">{copy.categories[finding.category]}</span>
        <span className="text-sm text-muted">{location}</span>
      </div>
      <p className="text-base text-secondary">
        {copy.explanations[finding.explanationKey](finding.explanationData)}
      </p>
      <code className="overflow-x-auto rounded-sm bg-paper px-3 py-2 font-sans text-base text-ink">
        {visibleExcerpt}
      </code>
      {finding.replacement !== undefined && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted">{copy.suggestionLabel}</span>
          <code className="rounded-sm bg-paper px-2 py-1 font-sans text-base text-ink">
            {makeInvisibleCharactersVisible(finding.replacement)}
          </code>
          <Button
            variant="secondary"
            aria-label={`${copy.applySuggestion}: ${copy.categories[finding.category]}, ${location}`}
            onClick={() => onApply(finding)}
          >
            {copy.applySuggestion}
          </Button>
        </div>
      )}
    </li>
  );
}

function makeInvisibleCharactersVisible(value: string): string {
  return value
    .replaceAll("\u200B", "⟦U+200B⟧")
    .replaceAll("\u200C", "⟦U+200C⟧")
    .replaceAll("\u200D", "⟦U+200D⟧")
    .replaceAll("\u2060", "⟦U+2060⟧")
    .replaceAll("\uFEFF", "⟦U+FEFF⟧")
    .replaceAll("\n", "↵");
}
