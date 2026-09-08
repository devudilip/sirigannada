"use client";

import { ArrowRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { CONTACT_CHANNELS } from "../lib/channels";

/** Three rule-separated rows, each an external link to the matching GitHub place. */
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
    </div>
  );
}
