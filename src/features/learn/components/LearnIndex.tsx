"use client";

import { useT } from "@/components/providers/AppProviders";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { LESSONS } from "../lib/lessons";

/** Lesson rows on 1 px rules under a 2 px section rule. */
export function LearnIndex() {
  const t = useT();
  return (
    <div><p className="mb-5 text-base text-secondary">{t("learnStart")}</p><ul className="rule-section">
      {LESSONS.map((lesson) => (
        <li key={lesson.href}>
          <DestinationLink href={lesson.href} titleKey={lesson.titleKey} subKey={lesson.subKey} />
        </li>
      ))}
    </ul></div>
  );
}
