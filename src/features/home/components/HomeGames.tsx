import { DestinationLink } from "@/components/ui/DestinationLink";

/** One-tap entry to the games hub beside the learn card. */
export function HomeGames() {
  return <DestinationLink href="/games" titleKey="gamesTitle" subKey="gamesSub" compact />;
}
