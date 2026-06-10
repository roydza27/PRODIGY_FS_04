import React from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: "full" | "constrained" | "narrow";
  className?: string;
}

/**
 * Standardized page layout wrapper to ensure consistent spacing and readability.
 * 
 * - 'full': 100% width, no max-width (Used for Chat)
 * - 'constrained': Max-width 7xl, centered (Used for Dashboards/Lists)
 * - 'narrow': Max-width 3xl, centered (Used for Forms/Settings/Profile)
 */
export function PageLayout({ children, variant = "constrained", className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto",
        variant === "constrained" && "max-w-7xl mx-auto px-6 py-8",
        variant === "narrow" && "max-w-3xl mx-auto px-6 py-10",
        variant === "full" && "px-0 py-0",
        className
      )}
    >
      {children}
    </div>
  );
}
