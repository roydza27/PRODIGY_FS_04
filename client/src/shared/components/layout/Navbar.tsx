"use client";

import * as React from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingCart,
  Store,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  LayoutDashboard,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

import type { SidebarData } from "@/shared/types/sidebar";
import { useAuthStore } from "@/app/store/auth.store";

// ─── Types ─────────────────────────────────────────────────────────────────

type NavbarProps = {
  /** navMain is intentionally omitted — add a horizontal nav row below the
   *  sticky bar if your design calls for it; keeping unused data out of this
   *  component avoids silent dead-code bugs. */
  navData: Pick<SidebarData, "brandName" | "navSecondary" | "userMenu">;
  onLogout: () => void;
};

// ─── Constants ──────────────────────────────────────────────────────────────

/** Shared Tailwind classes for every link inside the mobile sheet. */
const MOBILE_LINK =
  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium " +
  "text-zinc-300 transition-colors hover:bg-white/5 hover:text-white " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60";

const FILTER_ITEMS = [
  { label: "All Products",   to: "/products" },
  { label: "On Sale Deals",  to: "/products?onSale=1" },
  { label: "Free Shipping",  to: "/products?freeShipping=1" },
  { label: "New Arrivals",   to: "/products?sort=newest" },
] as const;

// ─── Sub-components ─────────────────────────────────────────────────────────

/**
 * SearchBar — shared between the sticky desktop row and the mobile row.
 * `compact` trims the placeholder text for narrow viewports.
 */
function SearchBar({
  value,
  onChange,
  onSubmit,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  compact?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="relative w-full" role="search">
      <label htmlFor={compact ? "search-mobile" : "search-desktop"} className="sr-only">
        Search products
      </label>

      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
        aria-hidden="true"
      />

      <input
        id={compact ? "search-mobile" : "search-desktop"}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={compact ? "Search products…" : "Search for products, brands and more…"}
        autoComplete="off"
        className={[
          "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04]",
          "pl-11 pr-12 text-sm text-white placeholder:text-zinc-500",
          "outline-none transition",
          "focus:border-[#DB4444]/50 focus:ring-2 focus:ring-[#DB4444]/20",
        ].join(" ")}
      />

      {/* Quick-filter dropdown — sits inside the form but is type="button"
          so it never accidentally submits the form. */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Quick filters"
            aria-haspopup="true"
            className={[
              "absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5",
              "text-zinc-400 transition-colors hover:bg-white/10 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]",
            ].join(" ")}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl border-white/10 bg-[#111113] text-white"
        >
          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-zinc-500">
            Quick Filters
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />

          {FILTER_ITEMS.map(({ label, to }) => (
            <DropdownMenuItem
              key={to}
              asChild
              className="cursor-pointer focus:bg-white/10 focus:text-white"
            >
              <Link to={to}>{label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * UserMenuItems — the list of account links + logout.
 * Rendered identically inside the desktop <DropdownMenu> and the mobile <Sheet>,
 * ensuring a single source of truth for roles, routes, and actions.
 *
 * Pass `onAction` to close the containing overlay after a navigation/logout.
 */
function UserMenuItems({
  userMenu,
  isSpecialRole,
  dashboardUrl,
  dashboardLabel,
  onLogout,
  /** Wrapper component: DropdownMenuItem vs. a plain <li>/<div>.
   *  Pass the shadcn DropdownMenuItem for the desktop menu, or null
   *  for the mobile sheet where we render plain Links directly. */
  itemWrapper: ItemWrapper,
}: {
  userMenu: SidebarData["userMenu"];
  isSpecialRole: boolean;
  dashboardUrl: string;
  dashboardLabel: string;
  onLogout: () => void;
  itemWrapper: React.ElementType | null;
}) {
  /**
   * Render a single nav item either wrapped in DropdownMenuItem (desktop)
   * or as a bare Link (mobile sheet).
   */
  const renderLink = (
    key: string,
    to: string,
    icon: React.ElementType | undefined,
    label: string,
    extraClass = "",
  ) => {
    const Icon = icon;
    const inner = (
      <Link
        to={to}
        className={
          ItemWrapper
            ? "flex items-center gap-2"
            : `${MOBILE_LINK} ${extraClass}`
        }
      >
        {Icon && <Icon className={ItemWrapper ? "size-4 shrink-0" : "h-[18px] w-[18px] text-zinc-400"} aria-hidden="true" />}
        <span className={ItemWrapper ? undefined : "font-medium text-white"}>{label}</span>
      </Link>
    );

    if (ItemWrapper) {
      return (
        <ItemWrapper key={key} asChild className="cursor-pointer focus:bg-white/10 focus:text-white">
          {inner}
        </ItemWrapper>
      );
    }
    return <React.Fragment key={key}>{inner}</React.Fragment>;
  };

  return (
    <>
      {/* Dashboard — admin / seller only */}
      {isSpecialRole &&
        renderLink(
          "dashboard",
          dashboardUrl,
          LayoutDashboard,
          dashboardLabel,
        )}

      {/* Dynamic account links from navData */}
      {userMenu?.map((item) =>
        renderLink(item.url, item.url, item.icon, item.label),
      )}

      {/* Logout */}
      {ItemWrapper ? (
        <ItemWrapper
          onSelect={onLogout}
          className="flex cursor-pointer items-center gap-2 text-red-400 focus:bg-white/10 focus:text-red-300"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          <span>Log out</span>
        </ItemWrapper>
      ) : (
        <button
          type="button"
          onClick={onLogout}
          className={
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 " +
            "text-sm font-medium text-red-400 transition-colors " +
            "hover:bg-red-500/10 hover:text-red-300 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          }
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          <span>Log out</span>
        </button>
      )}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Navbar({ navData, onLogout }: NavbarProps) {
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearSession = useAuthStore((s) => s.clearSession);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setSheetOpen(false);
  }, [location.pathname, location.search]);

  // ── Search state ──
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(
    () => searchParams.get("q") ?? "",
  );

  React.useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const handleSearch = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      } else {
        params.delete("q");
      }
      navigate(`/products?${params.toString()}`);
    },
    [navigate, searchParams, searchQuery],
  );

  // ── Auth helpers ──
  const handleLogout = React.useCallback(() => {
    clearSession();
    onLogout();
  }, [clearSession, onLogout]);

  if (!navData) return null;

  const { brandName, navSecondary, userMenu } = navData;

  const navUserData = {
    name:   authUser?.name   ?? "User",
    email:  authUser?.email  ?? "",
    avatar: authUser?.avatar ?? "",
  };

  const isSpecialRole = authUser?.role === "admin" || authUser?.role === "seller";
  const dashboardUrl  = authUser?.role === "admin" ? "/admin" : "/seller";
  const dashboardLabel =
    authUser?.role === "admin" ? "Admin Dashboard" : "Seller Dashboard";

  // Shared initials for avatars
  const initials = navUserData.name.slice(0, 2).toUpperCase();

  // ── Shared UserMenuItems props ──
  const sharedMenuProps = {
    userMenu,
    isSpecialRole,
    dashboardUrl,
    dashboardLabel,
    onLogout: handleLogout,
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111113]/90 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      {/*
        ┌─────────────────────────────────────────────────────────────────────┐
        │  IMPORTANT: overflow-hidden on the outer wrapper prevents horizontal │
        │  scroll. Every inner flex child uses min-w-0 so text/long items      │
        │  truncate instead of overflowing.                                    │
        └─────────────────────────────────────────────────────────────────────┘
      */}
      <div className="overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* ── Primary row ── */}
        <div className="flex h-16 items-center justify-between gap-3 lg:h-20">

          {/* Brand */}
          <Link
            to="/"
            className={[
              "flex shrink-0 items-center gap-2 rounded-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60",
            ].join(" ")}
            aria-label={`${brandName ?? "LocalStore"} — go to homepage`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Store className="h-5 w-5 text-[#DB4444]" aria-hidden="true" />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold tracking-tight text-white">
                {brandName ?? "LocalStore"}
              </span>
              <span className="block text-xs text-zinc-500">E-commerce platform</span>
            </span>
          </Link>

          {/* Desktop search — min-w-0 + flex-1 keeps it from pushing siblings */}
          <div className="hidden min-w-0 max-w-2xl flex-1 lg:block">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
            />
          </div>

          {/* Right-side controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Cart */}
            <Link to="/cart" aria-label="View cart">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            {/* ── Desktop auth ── */}
            {isAuthenticated ? (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Account menu"
                      aria-haspopup="true"
                      className={[
                        "flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04]",
                        "p-1 pr-3 text-sm font-medium text-zinc-100",
                        "transition-colors hover:bg-white/[0.07]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60",
                      ].join(" ")}
                    >
                      <Avatar className="h-7 w-7 rounded-full">
                        <AvatarImage src={navUserData.avatar} alt="" />
                        <AvatarFallback className="bg-zinc-800 text-[10px] text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {/* max-w ensures the name never pushes the caret off-screen */}
                      <span className="max-w-[100px] truncate">
                        {navUserData.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 rounded-xl border-white/10 bg-[#111113] text-white shadow-2xl"
                    align="end"
                    sideOffset={8}
                  >
                    {/* User identity */}
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        <Avatar className="h-8 w-8 shrink-0 rounded-full">
                          <AvatarImage src={navUserData.avatar} alt="" />
                          <AvatarFallback className="bg-white/10 text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid min-w-0 flex-1 leading-tight">
                          <span className="truncate text-sm font-medium">{navUserData.name}</span>
                          <span className="truncate text-xs text-zinc-400">{navUserData.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-white/10" />

                    {/* Prominent action pills: dashboard + return to store */}
                    <div className="flex flex-col gap-1 px-1 py-1">
                      {isSpecialRole && (
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer bg-white/10 text-white focus:bg-white/20 focus:text-white"
                        >
                          <Link to={dashboardUrl} className="flex items-center gap-2">
                            <LayoutDashboard className="size-4 shrink-0" aria-hidden="true" />
                            <span className="font-medium">{dashboardLabel}</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer bg-[#DB4444] text-white focus:bg-[#c53a3a] focus:text-white"
                      >
                        <Link to="/" className="flex items-center gap-2">
                          <Store className="size-4 shrink-0" aria-hidden="true" />
                          <span className="font-medium">Return to Store</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-white/10" />

                    {/* Dynamic account links + logout — shared via UserMenuItems */}
                    <DropdownMenuGroup>
                      <UserMenuItems
                        {...sharedMenuProps}
                        itemWrapper={DropdownMenuItem}
                      />
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                to="/login"
                className={[
                  "hidden rounded-2xl border border-white/10 bg-white/[0.04]",
                  "px-4 py-2 text-sm font-medium text-zinc-100",
                  "transition-colors hover:bg-white/[0.07]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60",
                  "sm:inline-flex",
                ].join(" ")}
              >
                Log in
              </Link>
            )}

            {/* ── Mobile hamburger ── */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  aria-haspopup="dialog"
                  className={[
                    "rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-zinc-100",
                    "transition-colors hover:bg-white/[0.07]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60",
                    "lg:hidden",
                  ].join(" ")}
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex w-[300px] max-w-[85vw] flex-col border-r border-white/10 bg-[#111113] p-0 text-white"
              >
                {/* Accessible sheet labels (visually hidden) */}
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>Main site navigation and account menu</SheetDescription>
                </SheetHeader>

                {/* Sheet header */}
                <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-4">
                  <Link
                    to="/"
                    className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
                    aria-label={`${brandName ?? "LocalStore"} — home`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <Store className="h-4 w-4 text-[#DB4444]" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-white">
                      {brandName ?? "LocalStore"}
                    </span>
                  </Link>
                </div>

                {/* Scrollable body */}
                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">

                  {/* Store section */}
                  <nav aria-label="Store navigation">
                    <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                      Store
                    </p>
                    <div className="flex flex-col gap-1">
                      {[
                        { href: "/#hero",              label: "Home" },
                        { href: "/#categories",        label: "Categories" },
                        { href: "/#featured-products", label: "Products" },
                        { href: "/#promo-banner",      label: "Deals" },
                        { href: "/#highlights",        label: "Highlights" },
                        { href: "/#cta",               label: "Support" },
                      ].map(({ href, label }) => (
                        <a
                          key={href}
                          href={href}
                          onClick={() => setSheetOpen(false)}
                          className={MOBILE_LINK}
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </nav>

                  {/* Secondary links (e.g. Help, About) */}
                  {navSecondary && navSecondary.length > 0 && (
                    <nav aria-label="Secondary navigation" className="mt-7 border-t border-white/10 pt-5">
                      <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                        More
                      </p>
                      <div className="flex flex-col gap-1">
                        {navSecondary.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.url}
                              to={item.url}
                              onClick={() => setSheetOpen(false)}
                              className={MOBILE_LINK}
                            >
                              {Icon && (
                                <Icon className="h-[18px] w-[18px] text-zinc-400" aria-hidden="true" />
                              )}
                              <span>{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </nav>
                  )}

                  {/* ── Account section (bottom of sheet) ── */}
                  <div className="mt-auto pt-8 pb-4">
                    <div className="border-t border-white/10 pt-5">
                      {isAuthenticated ? (
                        <nav aria-label="Account navigation">
                          {/* User card */}
                          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
                            <Avatar className="h-10 w-10 rounded-full border border-white/10">
                              <AvatarImage src={navUserData.avatar} alt="" />
                              <AvatarFallback className="bg-zinc-800 text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-sm font-medium text-white">
                                {navUserData.name}
                              </span>
                              <span className="truncate text-xs text-zinc-400">
                                {navUserData.email}
                              </span>
                            </div>
                          </div>

                          {/* 
                            UserMenuItems with itemWrapper=null renders plain
                            Links/buttons using MOBILE_LINK styles — same set of
                            links as the desktop dropdown, zero duplication.
                          */}
                          <div className="flex flex-col gap-1">
                            <UserMenuItems {...sharedMenuProps} itemWrapper={null} />
                          </div>
                        </nav>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/login"
                            className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
                          >
                            Log in
                          </Link>
                          <Link
                            to="/register"
                            className="flex items-center justify-center rounded-2xl bg-[#DB4444] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c53a3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
                          >
                            Sign up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ── Mobile search row (always visible below the main bar) ── */}
        <div className="border-t border-white/10 py-3 lg:hidden">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            compact
          />
        </div>
      </div>
    </nav>
  );
}