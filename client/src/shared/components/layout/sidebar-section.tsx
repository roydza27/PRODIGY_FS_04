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
    <SidebarGroup className="px-1 py-1">
      <SidebarGroupLabel className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 group-data-[collapsible=icon]:hidden">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}