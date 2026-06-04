"use client"

import React from "react"
import { ChevronDownIcon, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { useWorkspaceStore } from "@/feat/workspaces/store/workspace.store"
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace"
import { useAuthStore } from "@/app/stores/auth.store"
import { CreateWorkspaceModal } from "@/feat/workspaces/components/CreateWorkspaceModal"

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar()
  const { activeWorkspace, workspaces, isLoading } = useActiveWorkspace()
  const { setActiveWorkspaceId } = useWorkspaceStore()
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const authIsLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  React.useEffect(() => {
    if (
      !authIsLoading &&
      isAuthenticated &&
      !isLoading &&
      workspaces &&
      workspaces.length > 0 &&
      !activeWorkspace
    ) {
      setActiveWorkspaceId(workspaces[0]._id)
    }
  }, [
    authIsLoading,
    isAuthenticated,
    isLoading,
    workspaces,
    activeWorkspace,
    setActiveWorkspaceId,
  ])

  if (isLoading && !workspaces) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse bg-white/5 rounded-xl" />
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            {/* Fixed the Trigger to use asChild */}
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton 
                size="sg" 
                className="w-full justify-between hover:bg-white/5 aria-expanded:bg-white/5 aria-expanded:text-foreground text-muted-foreground transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
                    {activeWorkspace?.name.charAt(0).toUpperCase() || "W"}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground">
                      {activeWorkspace?.name || "Select Workspace"}
                    </span>
                    <span className="truncate text-xs">
                      {activeWorkspace?.memberCount || 0} members
                    </span>
                  </div>
                </div>
                <ChevronDownIcon className="size-4 opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 rounded-xl border-white/5 bg-[#111113]"
              align="start"
              side={isMobile ? "bottom" : "bottom"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                Workspaces
              </DropdownMenuLabel>
              
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => setActiveWorkspaceId(workspace._id)}
                  className="gap-2 p-2 focus:bg-white/5 rounded-lg cursor-pointer text-foreground"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{workspace.name}</span>
                  {activeWorkspace?._id === workspace._id && (
                    <DropdownMenuShortcut className="ml-auto text-xs text-muted-foreground">
                      Active
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-white/5 my-1" />

              <DropdownMenuItem 
                onClick={() => setIsModalOpen(true)} 
                className="gap-2 p-2 focus:bg-white/5 rounded-lg cursor-pointer text-foreground"
              >
                <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
                  <Plus className="size-4" />
                </div>
                <span className="text-sm font-medium">Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}