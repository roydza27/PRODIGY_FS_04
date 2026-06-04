import React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useWorkspaceStore } from "../store/workspace.store";
import { useActiveWorkspace } from "../hooks/useActiveWorkspace";
import { useAuthStore } from "@/app/stores/auth.store";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { activeWorkspace, workspaces, isLoading } = useActiveWorkspace();
  const { setActiveWorkspaceId } = useWorkspaceStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const authIsLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
    if (
      !authIsLoading &&
      isAuthenticated &&
      !isLoading &&
      workspaces &&
      workspaces.length > 0 &&
      !activeWorkspace
    ) {
      setActiveWorkspaceId(workspaces[0]._id);
    }
  }, [
    authIsLoading,
    isAuthenticated,
    isLoading,
    workspaces,
    activeWorkspace,
    setActiveWorkspaceId,
  ]);

  if (isLoading && !workspaces) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse bg-zinc-800/50" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {activeWorkspace?.name.charAt(0).toUpperCase() || "W"}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeWorkspace?.name || "Select Workspace"}
                  </span>
                  <span className="truncate text-xs">
                    {activeWorkspace?.memberCount || 0} members
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>

              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => setActiveWorkspaceId(workspace._id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  {workspace.name}
                  {activeWorkspace?._id === workspace._id && (
                    <DropdownMenuShortcut>Active</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsModalOpen(true)} className="gap-2 p-2">
                <Plus className="size-4" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}