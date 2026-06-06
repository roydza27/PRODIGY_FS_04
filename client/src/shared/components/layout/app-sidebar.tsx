"use client";

import * as React from "react";
import { WorkspaceSwitcher } from "@/shared/components/workspace/workspace-switcher";
import RoomSidebar from "@/feat/rooms/components/RoomSidebar";
import DMList from "@/feat/chat/components/DMList";
import { SidebarNavItem } from "@/shared/components/layout/sidebar-nav-item";
import { SidebarSection } from "@/shared/components/layout/sidebar-section";
import { NavUser } from "@/shared/components/layout/nav-user";
import { useAuthStore } from "@/app/stores/auth.store";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

import type { SidebarData } from "@/shared/types/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onLogout: () => void;
  sidebarData: SidebarData; 
};

export function AppSidebar({
  onLogout,
  sidebarData,
  ...props
}: AppSidebarProps) {
  const authUser = useAuthStore((state) => state.user);
  const { documents, navSecondary, userMenu } = sidebarData;

  const navUserData = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    avatar: authUser?.avatar || "",
  };

  return (
    // Removed collapsible prop entirely
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-white/5 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-1">
              <WorkspaceSwitcher />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Removed group-data padding transitions */}
      <SidebarContent className="px-2 py-4">
        <RoomSidebar />
        <DMList />

        <SidebarSection title="Workspace">
          {documents.map((item) => (
            <SidebarNavItem
              key={item.name}
              to={item.url}
              label={item.name}
              icon={item.icon}
            />
          ))}

          {navSecondary.map((item) => (
            <SidebarNavItem
              key={item.title}
              to={item.url}
              label={item.title}
              icon={item.icon}
            />
          ))}
        </SidebarSection>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser
              user={navUserData}
              onLogout={onLogout}
              items={userMenu ?? []}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}