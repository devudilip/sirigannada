"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

/** Static export has no server redirects: replace the URL on the client and leave a link behind. */
export function RedirectNotice({ href, noteKey, linkKey }: { href: string; noteKey: StringKey; linkKey: StringKey }) {
  const router = useRouter();
  const t = useT();
  useEffect(() => {
    router.replace(href);
  }, [router, href]);
  return (
    <p className="text-base text-secondary">
      {t(noteKey)}{" "}
      <Link href={href} className="text-accent underline underline-offset-4">
        {t(linkKey)}
      </Link>
    </p>
  );
}
