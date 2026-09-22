"use client";

import { ArrowRightIcon, InstagramIcon, XIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { CONTACT_CHANNELS, SOCIAL_LINKS } from "../lib/channels";

const SOCIAL_ICON = { instagram: InstagramIcon, x: XIcon } as const;

/** Three rule-separated rows, each an external link to the matching GitHub place, then the social accounts when set. */
export function ContactChannels() {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <ul className="rule-section">
        {CONTACT_CHANNELS.map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rule-row group flex items-center justify-between gap-4 py-4 min-h-14 hover:bg-elevated active:bg-paper-edge"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-lg font-semibold text-ink leading-snug">{t(channel.titleKey)}</span>
                <span className="text-sm text-secondary">{t(channel.subKey)}</span>
                <span className="mt-1 text-sm font-semibold text-accent-strong">{t(channel.id === "form" ? "contactOpenForm" : "contactOpen")}</span>
              </span>
              <ArrowRightIcon size={20} className="shrink-0 text-ink" />
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">{t("contactNote")}</p>
      {SOCIAL_LINKS.length > 0 && (
        <section className="flex flex-col gap-3 border-t-2 border-line-strong pt-6">
          <h2 className="text-lg font-semibold text-ink leading-snug">{t("socialFollow")}</h2>
          <p className="text-sm text-secondary">{t("socialFollowSub")}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICON[s.id];
              return (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center gap-2 text-base font-semibold text-accent-strong hover:text-ink">
                    <Icon size={20} />
                    <span>{t(s.labelKey)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
