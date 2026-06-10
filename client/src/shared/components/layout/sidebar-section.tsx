import type { ReactNode } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/shared/components/ui/sidebar";

type Props = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: Props) {
  return (
    <SidebarGroup className="px-2 py-2">
      <SidebarGroupLabel className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/30">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}