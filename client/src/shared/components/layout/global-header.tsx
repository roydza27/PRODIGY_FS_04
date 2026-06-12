"use client";

import React from "react";
import {
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

import { NotificationCenter } from "@/feat/chat/components/NotificationCenter";

export function GlobalHeader() {
  return (
    <header className="h-12 w-full shrink-0 border-b border-white/5 bg-[#09090B] px-3 flex items-center justify-between z-50">
      {/* Left */}
      <div className="flex flex-1 items-center">
        <div className="flex items-center md:hidden">
          <SidebarTrigger />
        </div>
      </div>

      {/* Center - Empty/Spacer */}
      <div className="hidden flex-1 items-center justify-center lg:flex" />

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-0.5">
        <NotificationCenter />

        <HeaderAction
          icon={<HelpCircle className="size-4" />}
          label="Help"
        />
      </div>
    </header>
  );
}

interface HeaderActionProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
}

function HeaderAction({
  icon,
  label,
  count,
  active,
}: HeaderActionProps) {
  return (
    <button
      type="button"
      title={label}
      className={cn(
        "group relative rounded-md p-2 transition-all duration-200",
        active
          ? "bg-white/10 text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}

      {count && count > 0 && (
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-[#09090B] bg-red-500" />
      )}
    </button>
  );
}