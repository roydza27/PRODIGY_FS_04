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
    <SidebarMenuItem className="px-0 py-0">
      <SidebarMenuButton 
        asChild 
        tooltip={label} 
        className="h-9 rounded-md transition-all duration-200"
      >
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "relative flex items-center gap-3 px-2 transition-all duration-200",
              isActive 
                ? "bg-white/10 text-white" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute -left-2 top-1.5 bottom-1.5 w-1 rounded-r-full bg-white" />
              )}
              <Icon className={cn("size-4 shrink-0 transition-transform duration-200", isActive && "scale-105")} />
              <span className="truncate text-[14px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}