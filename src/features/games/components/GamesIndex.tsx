import { DestinationLink } from "@/components/ui/DestinationLink";
import { GAMES } from "../lib/catalog";

export function GamesIndex() {
  return (
    <ul className="flex flex-col gap-3">
      {GAMES.map((game) => (
        <li key={game.href}>
          <DestinationLink href={game.href} titleKey={game.titleKey} subKey={game.subKey} />
        </li>
      ))}
    </ul>
  );
}
