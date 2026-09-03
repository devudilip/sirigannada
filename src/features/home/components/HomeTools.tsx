import { DestinationLink } from "@/components/ui/DestinationLink";
import { HOME_TOOLS } from "@/features/tools/lib/catalog";

export function HomeTools() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {HOME_TOOLS.map((tool) => (
        <li key={tool.href}>
          <DestinationLink href={tool.href} titleKey={tool.titleKey} subKey={tool.subKey} />
        </li>
      ))}
    </ul>
  );
}
