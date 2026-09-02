import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { ToolsIndex } from "@/features/tools/components/ToolsIndex";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.navTools.kn };

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <PageTitle k="navTools" sub="toolsSub" />
      <ToolsIndex />
    </div>
  );
}
