import { DestinationLink } from "@/components/ui/DestinationLink";

/** One tap to the proverb corpus. No fetch and no corpus text on the home page. */
export function HomeProverbs() {
  return <DestinationLink href="/proverbs" titleKey="proverbsTitle" subKey="proverbsSub" compact />;
}
