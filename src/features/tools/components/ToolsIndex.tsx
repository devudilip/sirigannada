import { DestinationLink } from "@/components/ui/DestinationLink";
import { TOOLS } from "../lib/catalog";

export function ToolsIndex() {
  return (
    <ul className="rule-section">
      {TOOLS.map((tool) => (
        <li key={tool.href}>
          <DestinationLink href={tool.href} titleKey={tool.titleKey} subKey={tool.subKey} />
        </li>
      ))}
    </ul>
  );
}
