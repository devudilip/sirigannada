import type { StringKey } from "@/lib/i18n";

export const GITHUB_REPO = "https://github.com/devudilip/sirigannada";

/**
 * Public feedback form for people without a GitHub account. A plain link, never embedded, so
 * nothing from Google loads on this site. Empty string hides the row until the owner sets it.
 */
export const FEEDBACK_FORM_URL = "https://forms.gle/w6MYLaomhdLogxiF6";

/**
 * Public social accounts. Plain outbound links, no embeds or scripts. An empty string hides that
 * link everywhere (footer, More, Contact) until the owner sets it — see docs/social-kit.md.
 */
export const INSTAGRAM_URL = "https://www.instagram.com/sirigannada.in";
export const X_URL = "https://x.com/sirigannadaIN";

export interface SocialLink {
  id: "instagram" | "x";
  labelKey: StringKey;
  href: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  ...(INSTAGRAM_URL ? [{ id: "instagram", labelKey: "socialInstagram", href: INSTAGRAM_URL } as const] : []),
  ...(X_URL ? [{ id: "x", labelKey: "socialX", href: X_URL } as const] : []),
];

export interface ContactChannel {
  id: "form" | "feedback" | "question" | "bug";
  titleKey: StringKey;
  subKey: StringKey;
  href: string;
}

/** The public channels. The project runs no server and keeps no inbox; the form is Google-hosted. */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  ...(FEEDBACK_FORM_URL ? [{ id: "form", titleKey: "contactFormTitle", subKey: "contactFormSub", href: FEEDBACK_FORM_URL } as const] : []),
  { id: "feedback", titleKey: "contactFeedbackTitle", subKey: "contactFeedbackSub", href: `${GITHUB_REPO}/discussions/categories/ideas` },
  { id: "question", titleKey: "contactQuestionTitle", subKey: "contactQuestionSub", href: `${GITHUB_REPO}/discussions/categories/q-a` },
  { id: "bug", titleKey: "contactBugTitle", subKey: "contactBugSub", href: `${GITHUB_REPO}/issues/new?template=bug.yml` },
];
