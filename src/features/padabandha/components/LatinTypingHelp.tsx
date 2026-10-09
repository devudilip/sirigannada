"use client";

import { useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import { LATIN_ANUSVARA, LATIN_CONSONANTS, LATIN_VOWELS } from "@/lib/kannada";
import { readAnswerInput } from "../lib/latinAnswer";

/** Sample Latin spellings; their Kannada is computed, never hand-written, so the sheet can't drift. */
const EXAMPLES = ["mane", "kannaDa", "shaale", "haNNu", "caMdra"] as const;

/** Groups tokens that type the same letter: "aa / A → ಆ". Keeps the scheme's own order. */
function groupByOutput(pairs: readonly (readonly [string, string])[]): { tokens: string[]; output: string }[] {
  const groups = new Map<string, string[]>();
  for (const [token, output] of pairs) groups.set(output, [...(groups.get(output) ?? []), token]);
  return [...groups].map(([output, tokens]) => ({ output, tokens }));
}

const VOWEL_ROWS = groupByOutput(Object.entries(LATIN_VOWELS).map(([token, [independent]]) => [token, independent] as const));
const CONSONANT_ROWS = groupByOutput(Object.entries(LATIN_CONSONANTS));

function KeyTable({ title, rows }: { title: string; rows: readonly { tokens: string[]; output: string }[] }) {
  return (
    <section className="mt-4">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.output} className="flex items-baseline gap-2 border-b border-line py-1">
            <dt lang="en" className="font-latin text-base text-secondary">{row.tokens.join(" / ")}</dt>
            <dd lang="kn" className="ml-auto font-serif text-lg text-ink">{row.output}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** How to type Kannada with English letters, derived from `latinToKannada`'s actual tables. */
export function LatinTypingHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  return (
    <Sheet open={open} onClose={onClose} title={t("padabandhaLatinHelpTitle")}>
      <p className="text-base leading-relaxed text-secondary">{t("padabandhaLatinHelpIntro")}</p>
      <section className="mt-4">
        <h3 className="text-base font-semibold text-ink">{t("padabandhaLatinExamples")}</h3>
        <ul className="mt-2 flex flex-col gap-1">
          {EXAMPLES.map((example) => (
            <li key={example} className="text-base text-ink">
              <span lang="en" className="font-latin">{example}</span> → <span lang="kn" className="font-serif text-lg">{readAnswerInput(example).kannada}</span>
            </li>
          ))}
        </ul>
      </section>
      <KeyTable title={t("alphabetVowels")} rows={VOWEL_ROWS} />
      <KeyTable title={t("alphabetConsonants")} rows={CONSONANT_ROWS} />
      <KeyTable title={t("padabandhaLatinAnusvara")} rows={[{ tokens: [`ka${LATIN_ANUSVARA}`], output: readAnswerInput(`ka${LATIN_ANUSVARA}`).kannada }]} />
    </Sheet>
  );
}
