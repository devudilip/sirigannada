"use client";

import { InstagramIcon, LanguageIcon, MoonIcon, SunIcon, XIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SOCIAL_LINKS } from "@/features/contact/lib/channels";
import { MINE, UTILITIES } from "../lib/catalog";
import { OfflineRow } from "./OfflineRow";

/** 1k More: two rule-separated groups of rows, then the footer links. */
export function MoreIndex() {
  const { locale, setLocale, theme, setTheme, t } = useApp();
  return (
    <div className="flex flex-col gap-8">
      <section>
        <SectionHeading k="moreMine" />
        <ul>
          {MINE.map((row) => (
            <li key={row.href}>
              <DestinationLink
                href={row.href}
                titleKey={row.titleKey}
                subKey={row.subKey}
                compact
              />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <SectionHeading k="moreTools" />
        <ul>
          {UTILITIES.map((row) => (
            <li key={row.href}>
              {row.href === "/tools/offline" ? (
                <OfflineRow />
              ) : (
                <DestinationLink
                  href={row.href}
                  titleKey={row.titleKey}
                  subKey={row.subKey}
                  compact
                />
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <SectionHeading k="moreFooter" />
        <ul>
          <li>
            <DestinationLink href="/about" titleKey="navAbout" subKey="aboutLinkSub" compact />
          </li>
          <li>
            <DestinationLink href="/credits" titleKey="navCredits" subKey="creditsSub" compact />
          </li>
          <li>
            <DestinationLink href="/contact" titleKey="navContact" subKey="contactSub" compact />
          </li>
          <li>
            <DestinationLink href="/privacy" titleKey="navPrivacy" subKey="privacySub" compact />
          </li>
          {SOCIAL_LINKS.map((s) => {
            const Icon = s.id === "instagram" ? InstagramIcon : XIcon;
            return (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rule-row flex items-center justify-between gap-4 py-3 min-h-14 h-full transition-colors hover:bg-elevated active:bg-paper-edge"
                >
                  <span className="text-lg font-semibold text-ink leading-snug">{t(s.labelKey)}</span>
                  <Icon size={20} className="shrink-0 text-ink" />
                </a>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setLocale(locale === "kn" ? "en" : "kn")}
              className="group rule-row flex items-center justify-between gap-4 py-3 min-h-14 h-full w-full text-left transition-colors hover:bg-elevated active:bg-paper-edge"
            >
              <span className="text-lg font-semibold text-ink leading-snug">{t("language")}</span>
              <LanguageIcon size={20} className="shrink-0 text-ink" />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="group rule-row flex items-center justify-between gap-4 py-3 min-h-14 h-full w-full text-left transition-colors hover:bg-elevated active:bg-paper-edge"
            >
              <span className="text-lg font-semibold text-ink leading-snug">{t("theme")}</span>
              {theme === "dark" ? (
                <SunIcon size={20} className="shrink-0 text-ink" />
              ) : (
                <MoonIcon size={20} className="shrink-0 text-ink" />
              )}
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}
