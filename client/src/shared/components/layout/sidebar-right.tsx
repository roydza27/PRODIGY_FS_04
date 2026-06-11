"use client";

import * as React from "react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useGetWorkspaceMembers } from "@/feat/workspaces/api/workspace.queries";
import type { WorkspaceMember, WorkspaceUser } from "@/feat/workspaces/types/workspace.types";

import { SidebarSection } from "@/shared/components/layout/sidebar-section";
import { SidebarNavItem } from "@/shared/components/layout/sidebar-nav-item";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

import {
  Users,
  UserPlus,
  Settings,
  Shield,
} from "lucide-react";

export function SidebarRight(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { activeWorkspace } =
    useActiveWorkspace();

  const workspaceId = activeWorkspace?._id;

  const {
    data: members = [],
    isLoading: membersLoading,
  } = useGetWorkspaceMembers(
    workspaceId ?? "",
    !!workspaceId
  );

  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="hidden border-l border-white/5 lg:flex"
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-white/5 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="truncate text-sm font-semibold">
                {activeWorkspace?.name ||
                  "No Workspace"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {activeWorkspace?.memberCount ??
                  0}{" "}
                Members
              </p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        {/* Members */}
        <SidebarSection title="Members">
          {membersLoading ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No members found
            </div>
          ) : (
            (members as WorkspaceMember[]).map((member) => {
              const user = member.userId as WorkspaceUser;

              const displayName =
                user?.displayName ||
                user?.name ||
                "Unknown";

              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatarUrl}
                    />
                    <AvatarFallback>
                      {displayName
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      {displayName}
                    </p>

                    <p className="text-xs capitalize text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </SidebarSection>

        {/* Actions */}
        <SidebarSection title="Actions">
          <SidebarNavItem
            to="/invites"
            label="Invite Members"
            icon={UserPlus}
          />

          <SidebarNavItem
            to="/settings"
            label="Workspace Settings"
            icon={Settings}
          />

          <SidebarNavItem
            to="/permissions"
            label="Permissions"
            icon={Shield}
          />
        </SidebarSection>

        {/* Stats */}
        <SidebarSection title="Workspace">
          <div className="space-y-3 px-3 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Members
              </span>

              <span>
                {activeWorkspace?.memberCount ??
                  members.length}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Visibility
              </span>

              <span className="capitalize">
                {activeWorkspace?.visibility ??
                  "private"}
              </span>
            </div>
          </div>
        </SidebarSection>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/5 p-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">
              Active Workspace
            </span>
          </div>

          <p className="mt-2 truncate text-sm font-medium">
            {activeWorkspace?.name ||
              "No Workspace"}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
