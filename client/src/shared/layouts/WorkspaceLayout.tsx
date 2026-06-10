import * as React from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/shared/components/layout/app-sidebar";
import { GlobalHeader } from "@/shared/components/layout/global-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { workspaceSidebarData } from "@/shared/constants/sidebar.constants";

export default function WorkspaceLayout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.replace("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "360px",
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col h-screen w-full overflow-hidden bg-[#09090B]">
          {/* 1. Global Header - Full Width */}
          <GlobalHeader />

          <div className="flex flex-1 overflow-hidden">
            {/* The Left Navigation Area (Rail + Sidebar) is now unified within AppSidebar */}
            <div className="flex flex-1 overflow-hidden relative">
              <AppSidebar
                onLogout={handleLogout}
                sidebarData={workspaceSidebarData}
              />

              <SidebarInset className="flex-1 overflow-hidden rounded-none border-none bg-[#111113] text-[#FAFAFA]">
                <main className="h-full w-full overflow-hidden">
                  <Outlet />
                </main>
              </SidebarInset>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
