"use client";

import React from "react";
import { Home, Plus } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useWorkspaceStore } from "@/feat/workspaces/store/workspace.store";
import { CreateWorkspaceModal } from "@/feat/workspaces/components/CreateWorkspaceModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export function WorkspaceRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceSlug } = useParams();
  const { workspaces } = useActiveWorkspace();
  const { setActiveWorkspaceId } = useWorkspaceStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const isHomeActive =
    location.pathname === "/" || location.pathname === "/workspaces";

  const handleWorkspaceSwitch = (workspace: any) => {
    setActiveWorkspaceId(workspace._id);
    navigate(`/w/${workspace.slug}`);
  };

  const handleHomeClick = () => {
    navigate("/workspaces");
  };

  return (
    <div className="flex h-full w-[80px] shrink-0 flex-col items-center border-r border-white/5 bg-[#09090B] py-4 text-[#FAFAFA]">
      <div className="flex w-full flex-1 flex-col items-center gap-3 overflow-y-auto no-scrollbar">
        {/* Home Button */}
        <RailItem
          icon={<Home className="size-5" />}
          label="Home"
          active={isHomeActive}
          onClick={handleHomeClick}
          activeColor="bg-primary text-primary-foreground" 
        />

        {/* Subtle Divider between Home and Workspaces */}
        <div className="mx-auto h-px w-8 bg-white/10" />

        {/* Workspace List */}
        {workspaces?.map((workspace) => (
          <RailItem
            key={workspace._id}
            label={workspace.name}
            active={workspaceSlug === workspace.slug}
            onClick={() => handleWorkspaceSwitch(workspace)}
            fallback={workspace.name.charAt(0).toUpperCase()}
          />
        ))}

        {/* Create Workspace - Now directly part of the main list flow */}
        <RailItem
          icon={<Plus className="size-5" />}
          label="Create Workspace"
          onClick={() => setIsModalOpen(true)}
          activeColor="bg-emerald-500 text-white"
          hoverColor="hover:bg-emerald-500 hover:text-white"
        />
      </div>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

interface RailItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  fallback?: string;
  activeColor?: string;
  hoverColor?: string;
  size?: "default" | "sm";
}

function RailItem({
  icon,
  label,
  active,
  onClick,
  fallback,
  activeColor = "bg-primary text-primary-foreground",
  hoverColor = "hover:bg-primary hover:text-primary-foreground",
  size = "default",
}: RailItemProps) {
  const containerSize = size === "sm" ? "size-9" : "size-12";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className="group relative flex w-full items-center justify-center py-1"
        >
          {/* Active indicator */}
          <div
            className={cn(
              "absolute left-0 w-1 rounded-r-full bg-white transition-all duration-300",
              active ? "h-10 scale-100" : "h-5 scale-0 group-hover:scale-100"
            )}
          />

          {/* Icon Container */}
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              containerSize,
              active
                ? cn(activeColor, "rounded-[16px] shadow-md")
                : "rounded-[24px] bg-[#1E1F22] text-zinc-400 group-hover:rounded-[16px] group-hover:bg-[#313338] group-hover:text-white",
              !active && hoverColor.includes("hover:bg-emerald-500") && "hover:bg-emerald-500 hover:text-white"
            )}
          >
            {icon ? (
              icon
            ) : (
              <span className="text-lg font-semibold">
                {fallback}
              </span>
            )}
          </div>
        </button>
      </TooltipTrigger>

      <TooltipContent side="right" sideOffset={12} className="font-semibold">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}