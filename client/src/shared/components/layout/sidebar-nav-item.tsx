import { NavLink } from "react-router-dom";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import type { SidebarIcon } from "@/shared/types/sidebar";

import { cn } from "@/lib/utils"

type Props = {
  to: string;
  label: string;
  icon: SidebarIcon;
  end?: boolean;
};

export function SidebarNavItem({ to, label, icon: Icon, end }: Props) {
  return (
    <SidebarMenuItem className="px-1 py-0.5">
      <SidebarMenuButton 
        asChild 
        tooltip={label} 
        className="h-10 rounded-xl transition-all duration-300"
      >
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "relative flex items-center gap-3 px-3 transition-all duration-200",
              isActive 
                ? "bg-white/[0.06] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" 
                : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
            )
          }
        >
          {/* Active indicator bar */}
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              )}
              <Icon className={cn("size-4 shrink-0 transition-transform duration-200", isActive && "scale-105")} />
              <span className="truncate text-[13px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}