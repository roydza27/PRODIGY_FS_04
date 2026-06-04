import * as React from "react";
import { Link } from "react-router-dom";
import { LogOut, MoreHorizontal, Store } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

type NavUserItem = {
  label: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
  items?: NavUserItem[];
};

export function NavUser({ user, onLogout, items = [] }: NavUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Universal Button: Works in Navbar AND collapses in Sidebar */}
        <button
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-left text-sm transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 data-[state=open]:bg-white/[0.06]"
        >
          <Avatar className="h-8 w-8 shrink-0 rounded-lg">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="rounded-lg bg-zinc-800 text-xs font-medium text-zinc-300">
              {user?.name?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Magic classes hide text and icon when sidebar collapses */}
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium text-white">{user?.name}</span>
            <span className="truncate text-xs text-[#A1A1AA]">
              {user?.email}
            </span>
          </div>

          <MoreHorizontal className="ml-auto size-4 shrink-0 text-zinc-400 group-data-[collapsible=icon]:hidden" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-xl border-white/10 bg-[#111113] text-white"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 shrink-0 rounded-lg">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-lg bg-white/10 text-white">
                {user?.name?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs text-[#A1A1AA]">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <div className="px-1 py-1">
          <DropdownMenuItem 
            asChild 
            className="cursor-pointer bg-[#DB4444] text-white focus:bg-[#c53a3a] focus:text-white"
          >
            <Link to="/" className="flex items-center gap-2">
              <Store className="size-4 shrink-0" />
              <span className="font-medium">Return to Store</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuGroup>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem 
                key={item.url} 
                asChild 
                className="cursor-pointer focus:bg-white/10 focus:text-white"
              >
                <Link to={item.url} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem 
          onSelect={onLogout} 
          className="flex cursor-pointer items-center gap-2 text-red-400 focus:bg-white/10 focus:text-red-300"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}