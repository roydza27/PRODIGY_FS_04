"use client";

import * as React from "react";
import { Search, UserPlus, MessageSquareMore } from "lucide-react";
import RoomSidebar from "@/feat/rooms/components/RoomSidebar";
import DMList from "@/feat/chat/components/DMList";
import { SidebarNavItem } from "@/shared/components/layout/sidebar-nav-item";
import { SidebarSection } from "@/shared/components/layout/sidebar-section";
import { NavUser } from "@/shared/components/layout/nav-user";
import { useAuthStore } from "@/app/stores/auth.store";
import { useParams, useLocation } from "react-router-dom";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { WorkspaceRail } from "@/shared/components/workspace/workspace-rail";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/shared/components/ui/logo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
  const { workspaceSlug } = useParams();
  const location = useLocation();
  const authUser = useAuthStore((state) => state.user);
  const { documents = [], navSecondary = [], userMenu = [] } = sidebarData;
  const { activeWorkspace } = useActiveWorkspace();
  const isMobile = useIsMobile();

  const isWorkspaceContext = !!workspaceSlug;

  const navUserData = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    avatar: authUser?.avatarUrl || "",
  };

  // Convert SidebarItem to NavUserItem
  const navUserItems = userMenu.map(item => ({
    label: item.label || item.name || item.title || "",
    url: item.url,
    icon: item.icon
  }));

  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "none"} 
      className="border-r border-white/5 shrink-0"
      {...props}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Unified Left Navigation Area: Rail + Context Content */}
        <WorkspaceRail />

        {/* Context Content Section */}
        <div className="flex flex-1 flex-col min-w-0 ">
          <SidebarHeader className="h-12 border-b border-white/5 px-4 flex flex-row items-center bg-[#0B0B0D]">
            <span className="text-[14px] font-bold tracking-tight text-white/90 truncate">
              {isWorkspaceContext ? (activeWorkspace?.name || "Workspace") : "Home"}
            </span>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4 no-scrollbar bg-[#0B0B0D]">
          {isWorkspaceContext ? (
            <>
              <RoomSidebar />
              <div className="mt-6">
                <SidebarSection title="Settings">
                  {documents.map((item) => (
                    <SidebarNavItem
                      key={item.name || item.title || item.url}
                      to={`/w/${workspaceSlug}${item.url}`}
                      label={item.name || item.title || ""}
                      icon={item.icon!}
                    />
                  ))}

                  {navSecondary.map((item) => (
                    <SidebarNavItem
                      key={item.title || item.name || item.url}
                      to={`/w/${workspaceSlug}${item.url}`}
                      label={item.title || item.name || ""}
                      icon={item.icon!}
                    />
                  ))}
                </SidebarSection>
              </div>
            </>
          ) : (
            <div className="space-y-6 border-white">
              <SidebarSection title="Navigation">
                <SidebarNavItem
                  to="/workspaces"
                  label="Home"
                  icon={MessageSquareMore}
                  end={!location.pathname.startsWith("/dm/")}
                />
                <SidebarNavItem
                  to="/workspaces/search"
                  label="Search"
                  icon={Search}
                />
                <SidebarNavItem
                  to="/workspaces/invites"
                  label="Invites"
                  icon={UserPlus}
                />
              </SidebarSection>

              <DMList />
            </div>
          )}
        </SidebarContent>
      </div>
    </div>

    <SidebarFooter className="border-t border-white/5 p-3">
        <NavUser
          user={navUserData}
          onLogout={onLogout}
          items={navUserItems}
        />
      </SidebarFooter>
    </Sidebar>
  );
}