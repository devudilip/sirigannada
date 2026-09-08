import type { StringKey } from "@/lib/i18n";

export const GITHUB_REPO = "https://github.com/devudilip/sirigannada";

export interface ContactChannel {
  id: "feedback" | "question" | "bug";
  titleKey: StringKey;
  subKey: StringKey;
  href: string;
}

/** The three public channels. All on GitHub: the project runs no server and keeps no inbox. */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  { id: "feedback", titleKey: "contactFeedbackTitle", subKey: "contactFeedbackSub", href: `${GITHUB_REPO}/discussions/categories/ideas` },
  { id: "question", titleKey: "contactQuestionTitle", subKey: "contactQuestionSub", href: `${GITHUB_REPO}/discussions/categories/q-a` },
  { id: "bug", titleKey: "contactBugTitle", subKey: "contactBugSub", href: `${GITHUB_REPO}/issues/new?template=bug.yml` },
];
