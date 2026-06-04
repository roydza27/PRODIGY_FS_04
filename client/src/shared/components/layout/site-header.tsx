"use client";

import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, SearchIcon, Check, Circle } from "lucide-react";

import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
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
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

// Global path regex analyzer engine parsing localized routing breadcrumbs reactively
function getBreadcrumbs(pathname: string): BreadcrumbItemType[] {
  const isAdmin = pathname.startsWith("/admin");
  const isSeller = pathname.startsWith("/seller");
  const isAccount = pathname.startsWith("/account");
  const isShop =
    pathname.startsWith("/products") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  if (pathname === "/") {
    return [{ label: "Home" }];
  }

  // A. Admin Portal Breadcrumbs
  if (isAdmin) {
    const base = [{ label: "Admin", href: "/admin" }];
    if (pathname === "/admin") return [...base, { label: "Dashboard" }];
    if (pathname === "/admin/products") return [...base, { label: "Products" }];
    if (pathname === "/admin/orders") return [...base, { label: "Orders" }];
    if (pathname === "/admin/customers") return [...base, { label: "Customers" }];
    if (pathname === "/admin/analytics") return [...base, { label: "Analytics" }];
    if (pathname === "/admin/inventory") return [...base, { label: "Inventory" }];
    if (pathname === "/admin/reports") return [...base, { label: "Reports" }];
    if (pathname === "/admin/shipments") return [...base, { label: "Shipments" }];
    if (pathname === "/admin/seller-applications") return [...base, { label: "Seller Applications" }];
    if (pathname === "/admin/settings") return [...base, { label: "Settings" }];
    if (pathname === "/admin/staff") return [...base, { label: "Staff" }];
    if (pathname === "/admin/support") return [...base, { label: "Support" }];
    if (pathname.startsWith("/admin/products/")) {
      return [...base, { label: "Products", href: "/admin/products" }, { label: pathname.endsWith("/edit") ? "Edit Product" : "Product Details" }];
    }
    return [...base, { label: "Overview" }];
  }

  // B. Seller Portal Breadcrumbs
  if (isSeller) {
    const base = [{ label: "Seller", href: "/seller" }];
    if (pathname === "/seller") return [...base, { label: "Dashboard" }];
    if (pathname === "/seller/products") return [...base, { label: "Products" }];
    if (pathname === "/seller/orders") return [...base, { label: "Orders" }];
    if (pathname === "/seller/analytics") return [...base, { label: "Analytics" }];
    if (pathname === "/seller/inventory") return [...base, { label: "Inventory" }];
    if (pathname === "/seller/earnings") return [...base, { label: "Earnings" }];
    if (pathname === "/seller/shipments") return [...base, { label: "Shipments" }];
    if (pathname === "/seller/settings") return [...base, { label: "Settings" }];
    if (pathname === "/seller/support") return [...base, { label: "Support" }];
    if (pathname.startsWith("/seller/products/")) {
      return [...base, { label: "Products", href: "/seller/products" }, { label: pathname.endsWith("/edit") ? "Edit Listing" : "Listing Details" }];
    }
    return [...base, { label: "Overview" }];
  }

  // C. Consumer Account Breadcrumbs
  if (isAccount) {
    const base = [{ label: "Account", href: "/account" }];
    if (pathname === "/account") return [...base, { label: "Overview" }];
    if (pathname === "/account/orders") return [...base, { label: "Orders" }];
    if (pathname === "/account/wishlist") return [...base, { label: "Wishlist" }];
    if (pathname === "/account/reviews") return [...base, { label: "Reviews" }];
    if (pathname === "/account/profile") return [...base, { label: "Profile" }];
    if (pathname === "/account/settings") return [...base, { label: "Settings" }];
    if (pathname === "/account/invoices") return [...base, { label: "Invoices" }];
    if (pathname === "/account/history") return [...base, { label: "Purchase History" }];
    if (pathname === "/account/saved") return [...base, { label: "Saved Items" }];
    if (pathname.startsWith("/account/orders/")) {
      return [...base, { label: "Orders", href: "/account/orders" }, { label: "Order Details" }];
    }
    return [...base, { label: "Overview" }];
  }

  // D. General Storefront Breadcrumbs
  if (isShop) {
    const base = [{ label: "Shop", href: "/products" }];
    if (pathname === "/products") return [...base, { label: "Products" }];
    if (pathname.startsWith("/products/")) {
      return [...base, { label: "Products", href: "/products" }, { label: "Product Details" }];
    }
    if (pathname === "/cart") return [...base, { label: "Cart" }];
    if (pathname === "/checkout") return [...base, { label: "Checkout" }];
    return [...base, { label: "Browse" }];
  }

  if (pathname === "/support") return [{ label: "Support" }];
  if (pathname === "/search") return [{ label: "Search" }];

  return [{ label: "Overview" }];
}

export function SiteHeader() {
  const { pathname } = useLocation();
  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

  // Integrated live workspace notifications alert feeds state stack
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "h_nt_1", title: "Stock Replenishment Alert", description: "Wireless Headphones dipped below safety reorder threshold limits.", time: "5m ago", unread: true },
    { id: "h_nt_2", title: "New Registration Request", description: "A new vendor application is awaiting manual document verification.", time: "1h ago", unread: true },
    { id: "h_nt_3", title: "Settlement Cleared", description: "Automated core bank settlement payout cycle completed successfully.", time: "1d ago", unread: false }
  ]);

  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#27272A] bg-[#111113]/95 backdrop-blur supports-[backdrop-filter]:bg-[#111113]/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) text-left">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        
        {/* Left Elements Row: SideTrigger + Breadcrumb Matrix */}
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <span key={`${item.label}-${index}`} className="contents">
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {item.href && !isLast ? (
                        <BreadcrumbLink asChild className="text-[#A1A1AA] hover:text-[#FAFAFA]">
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-heading font-semibold text-[#FAFAFA]">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                    )}
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Elements Row: Dynamic Input Search + Notification Dropdown */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-1.5 text-sm text-[#A1A1AA] transition-colors hover:border-[#A1A1AA]/50 md:flex cursor-text select-none">
            <SearchIcon className="size-4 text-zinc-500" />
            <span>Search components...</span>
            <kbd className="ml-8 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-1.5 font-mono text-[10px] font-medium text-[#A1A1AA]">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Interactive Notification Overlay Drawer Panel Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-xl text-[#A1A1AA] border border-transparent transition-all hover:text-[#FAFAFA] hover:bg-white/5 hover:border-white/5 focus:outline-none cursor-pointer outline-none">
                <BellIcon className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-[#DB4444] text-[9px] font-bold font-mono text-white flex items-center justify-center ring-2 ring-[#111113]">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 border-[#27272A] bg-[#111113] p-0 text-white rounded-2xl shadow-xl overflow-hidden mt-2">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 bg-black/20">
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
                    No active operations logged.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3.5 transition-colors relative hover:bg-white/[0.02] ${
                        item.unread ? "bg-white/[0.01]" : ""
                      }`}
                    >
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

        </div>
      </div>
    </header>
  );
}