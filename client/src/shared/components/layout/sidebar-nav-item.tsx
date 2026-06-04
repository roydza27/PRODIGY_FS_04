import { NavLink } from "react-router-dom";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import type { SidebarIcon } from "@/shared/types/sidebar";

type Props = {
  to: string;
  label: string;
  icon: SidebarIcon;
  end?: boolean;
};

export function SidebarNavItem({ to, label, icon: Icon, end }: Props) {
  return (
    <SidebarMenuItem className="px-0 py-0.5">
      <SidebarMenuButton asChild tooltip={label} className="h-auto p-0">
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              "group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all duration-200",
              "min-h-[44px]",

              // collapsed = true centered square
              "group-data-[collapsible=icon]:mx-auto",
              "group-data-[collapsible=icon]:grid",
              "group-data-[collapsible=icon]:h-10",
              "group-data-[collapsible=icon]:w-10",
              "group-data-[collapsible=icon]:place-items-center",
              "group-data-[collapsible=icon]:gap-0",
              "group-data-[collapsible=icon]:px-0",
              "group-data-[collapsible=icon]:rounded-xl",

              isActive
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            ].join(" ")
          }
        >
          <Icon
            className="
              size-[18px] shrink-0 transition-all duration-200
              group-hover:scale-105
              group-data-[collapsible=icon]:size-5
            "
          />

          <span className="truncate font-medium group-data-[collapsible=icon]:hidden">
            {label}
          </span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}