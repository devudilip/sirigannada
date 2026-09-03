import { DestinationLink } from "@/components/ui/DestinationLink";
import { LESSONS } from "../lib/lessons";

export function LearnIndex() {
  return (
    <ul className="flex flex-col gap-3">
      {LESSONS.map((lesson) => (
        <li key={lesson.href}>
          <DestinationLink href={lesson.href} titleKey={lesson.titleKey} subKey={lesson.subKey} />
        </li>
      ))}
    </ul>
  );
}
