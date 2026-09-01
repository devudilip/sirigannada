import { BookIcon, HomeIcon, InfoIcon, SearchIcon } from "@/components/icons";
import type { NavItem } from "./navItems";

export function NavIcon({ icon, size = 22 }: { icon: NavItem["icon"]; size?: number }) {
  switch (icon) {
    case "home":
      return <HomeIcon size={size} />;
    case "search":
      return <SearchIcon size={size} />;
    case "book":
      return <BookIcon size={size} />;
    case "info":
      return <InfoIcon size={size} />;
  }
}
