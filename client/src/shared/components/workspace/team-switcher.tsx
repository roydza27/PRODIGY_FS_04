"use client"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { ChevronDownIcon } from "lucide-react"

export function TeamSwitcher({
  workspace,
}: {
  workspace: {
    name: string
    logo: string
    plan: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="w-full justify-between hover:bg-white/5 aria-expanded:bg-white/5 aria-expanded:text-foreground text-muted-foreground transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
                  {workspace.logo}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">{workspace.name}</span>
                  <span className="truncate text-xs">{workspace.plan}</span>
                </div>
              </div>
              <ChevronDownIcon className="size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-xl border-white/5 bg-[#111113]"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuItem className="gap-2 p-2 focus:bg-white/5 rounded-lg cursor-pointer text-foreground">
              <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
                {workspace.logo}
              </div>
              <span className="text-sm font-medium">{workspace.name}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
