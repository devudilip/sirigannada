"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";
import { ArrowLeftIcon } from "@/components/icons";

type PageTitleProps = {
  sub?: StringKey;
  detail?: string;
  /** Hide the mobile back button on the five main tabs (Home, Search, Library, Games, More) — there's nowhere for it to go back to within the section. */
  showBack?: boolean;
  /** `lang` for a literal `title`, when it's in a different language than the current UI locale (e.g. an English toggle over Kannada content). */
  lang?: string;
  /** Skip the h1/detail/sub row — used by pages that draw their own title but still want the mobile back button at the very top. */
  showHeading?: boolean;
} & ({ k: StringKey; title?: undefined } | { k?: undefined; title?: string });

/** 28 px page title, flush left. `detail` is a localised count line shown at the right. Sections below carry their own 2 px rules. Pass `k` for a translated title, or `title` for a literal one (e.g. a collection or book name that varies by locale but isn't itself a translation string). */
export function PageTitle({
  k,
  title,
  sub,
  detail,
  showBack = true,
  showHeading = true,
  lang,
}: PageTitleProps) {
  const t = useT();
  const router = useRouter();
  const heading = title ?? (k ? t(k) : "");
  return (
    <div className="mb-3">
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t("navBack")}
          className="-ml-2 mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-accent-strong lg:hidden"
        >
          <ArrowLeftIcon size={24} />
        </button>
      )}
      {showHeading && (
        <>
          <div className="flex items-baseline justify-between gap-4">
            <h1
              className="text-xl sm:text-2xl font-bold text-ink leading-tight"
              lang={lang}
            >
              {heading}
            </h1>
            {detail && (
              <p className="text-sm text-muted max-w-[55%] text-right">
                {detail}
              </p>
            )}
          </div>
          {sub && <p className="mt-1 text-base text-secondary">{t(sub)}</p>}
        </>
      )}
    </div>
  );
}
