"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Bell, Check, Circle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

type DashboardHeaderProps = {
  onLogout: () => void;
};

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  // Stateful alert stack tracking system event notifications reactively
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "nt_1",
      title: "Stock Replenishment Alert",
      description: "Wireless Headphones dipped below safety reorder threshold limits.",
      time: "5m ago",
      unread: true,
    },
    {
      id: "nt_2",
      title: "New Registration Request",
      description: "A new vendor application is awaiting manual document verification.",
      time: "1h ago",
      unread: true,
    },
    {
      id: "nt_3",
      title: "Settlement Cleared",
      description: "Automated core bank settlement payout cycle completed successfully.",
      time: "1d ago",
      unread: false,
    },
  ]);

  // Compute unread alert metrics on data array updates reactively
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid closing dropdown window layer context
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents drop panel from closing prematurely when clicking internal actions
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur text-left">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl h-9"
        >
          <Search className="mr-2 h-4 w-4 text-zinc-400" />
          Search
        </Button>

        <Button size="sm" className="hidden md:flex rounded-xl h-9 bg-[#DB4444] text-white hover:bg-[#c53a3a]">
          New Report
        </Button>

        {/* NOTIFICATION dropdown menu panel */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 outline-none"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#DB4444] text-[9px] font-bold font-mono text-white ring-2 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 border-white/10 bg-[#111113] p-0 text-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 bg-black/10">
              <span className="text-xs font-bold tracking-wide uppercase text-zinc-400">Operations Feed</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="bg-transparent border-none p-0 text-xs text-[#DB4444] hover:text-[#c53a3a] hover:underline font-medium cursor-pointer outline-none"
                >
                  Clear Unread
                </button>
              )}
            </div>

            <div className="divide-y divide-white/5 max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-zinc-500 font-medium">
                  No system logs available.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3.5 transition-colors relative hover:bg-white/[0.02] ${
                      item.unread ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    {/* FIXED: Reconstructed indicator icons wrapper to eliminate rendering layout collision locks */}
                    <button
                      type="button"
                      onClick={(e) => toggleReadStatus(item.id, e)}
                      className="mt-0.5 group flex items-center justify-center size-5 bg-transparent border-none p-0 cursor-pointer text-zinc-500 shrink-0 outline-none"
                    >
                      {item.unread ? (
                        <Circle className="size-2 fill-[#DB4444] text-[#DB4444] group-hover:hidden" />
                      ) : (
                        <Check className="size-3.5 text-zinc-500 group-hover:text-amber-400" />
                      )}
                      {item.unread && (
                        <Check className="size-3.5 text-emerald-400 hidden group-hover:block" />
                      )}
                    </button>

                    <div className="space-y-0.5 min-w-0 flex-1 select-text">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${item.unread ? "font-bold text-white" : "font-medium text-zinc-300"}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] font-mono text-zinc-500 shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] leading-normal text-zinc-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* PROFILE ACCOUNT ACTION TRAY MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 items-center gap-1 rounded-xl border border-white/5 bg-white/5 pl-1.5 pr-1 hover:bg-white/10 cursor-pointer transition-colors outline-none">
              <Avatar className="h-6 w-6 rounded-lg">
                <AvatarFallback className="rounded-lg bg-white/10 text-xs font-bold text-white">R</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 border-white/10 bg-[#111113] text-white rounded-xl shadow-xl">
            <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold py-1.5 px-2.5">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="text-sm rounded-lg focus:bg-white/5 cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-sm rounded-lg focus:bg-white/5 cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={onLogout} className="text-sm rounded-lg focus:bg-white/5 cursor-pointer text-red-400 focus:text-red-400">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}