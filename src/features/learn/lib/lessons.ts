import type { StringKey } from "@/lib/i18n";

export interface LessonEntry {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}

/** Published learn-section pages. Add a row here when a new lesson ships. */
export const LESSONS: readonly LessonEntry[] = [
  { href: "/learn/alphabet", titleKey: "alphabetTitle", subKey: "alphabetSub" },
];
