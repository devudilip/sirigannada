"use client";

import { CheckIcon, CloseIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";

/**
 * Shared multiple-choice UI for the match and gunitakshara practice modes: renders `choices`,
 * highlights correct/incorrect once answered, and exposes Next/Restart. The prompt itself (what
 * question is being asked) is rendered by the caller since it differs by mode.
 */
export function PracticeQuizChoices({
  choices,
  correctIndex,
  selectedIndex,
  answered,
  done,
  score,
  total,
  onAnswer,
  onNext,
  onRestart,
  choiceLang,
}: {
  choices: string[];
  correctIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  done: boolean;
  score: number;
  total: number;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onRestart: () => void;
  /** "kn" when choices are Kannada aksharas, "en" when they are English meanings. */
  choiceLang: "kn" | "en";
}) {
  const t = useT();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-secondary">{t("practiceScore", { correct: score, total })}</p>
      <div role="group" aria-label={t("practiceChooseAnswer")} className="flex flex-col gap-2">
        {choices.map((choice, i) => {
          const isCorrect = answered && i === correctIndex;
          const isWrongPick = answered && i === selectedIndex && i !== correctIndex;
          return (
            <button
              key={choice}
              type="button"
              lang={choiceLang}
              disabled={answered}
              onClick={() => onAnswer(i)}
              className={`flex min-h-11 items-center justify-between gap-2 rounded-md border p-3 text-left text-base transition-colors ${
                isCorrect
                  ? "border-accent bg-accent-soft text-ink"
                  : isWrongPick
                    ? "border-line-strong bg-paper-edge text-secondary"
                    : "border-line bg-elevated text-ink disabled:opacity-70"
              }`}
            >
              <span>{choice}</span>
              {isCorrect && <CheckIcon size={18} className="shrink-0" />}
              {isWrongPick && <CloseIcon size={18} className="shrink-0" />}
            </button>
          );
        })}
      </div>
      {answered && !done && (
        <p role="status" className="text-base font-medium text-ink">
          {selectedIndex === correctIndex ? t("practiceCorrect") : t("practiceIncorrect")}
        </p>
      )}
      {done ? (
        <div className="flex flex-col gap-3">
          <p role="status" className="text-lg font-semibold text-ink">
            {t("practiceDone")}
          </p>
          <p className="text-base text-secondary">{t("practiceDoneScore", { correct: score, total })}</p>
          <Button onClick={onRestart}>{t("practiceRestart")}</Button>
        </div>
      ) : (
        answered && <Button onClick={onNext}>{t("practiceNext")}</Button>
      )}
    </div>
  );
}
