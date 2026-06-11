import type { LucideIcon } from "lucide-react";

export type SidebarIcon = LucideIcon | React.ComponentType<{ className?: string }>;

export interface SidebarItem {
  title?: string;
  name?: string;
  label?: string;
  url: string;
  icon?: SidebarIcon;
  isActive?: boolean;
}

export interface SidebarData {
  brandName: string;
  navMain?: SidebarItem[];
  documents?: SidebarItem[];
  navSecondary?: SidebarItem[];
  userMenu?: SidebarItem[];
}
