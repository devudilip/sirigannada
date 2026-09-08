import { DestinationLink } from "@/components/ui/DestinationLink";
import { LESSONS } from "../lib/lessons";

/** Lesson rows on 1 px rules under a 2 px section rule. */
export function LearnIndex() {
  return (
    <ul className="rule-section">
      {LESSONS.map((lesson) => (
        <li key={lesson.href}>
          <DestinationLink href={lesson.href} titleKey={lesson.titleKey} subKey={lesson.subKey} />
        </li>
      ))}
    </ul>
  );
}
