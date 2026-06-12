import { MessageSquareMore } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ 
  className, 
  iconClassName, 
  showText = false, 
  textClassName,
  size = "md"
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-10 w-10 rounded-xl",
    xl: "h-12 w-12 rounded-[16px]"
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex items-center justify-center bg-brand shadow-lg shadow-brand/20 ring-1 ring-white/10",
        sizeClasses[size],
        iconClassName
      )}>
        <MessageSquareMore className={cn("text-brand-foreground", iconSizeClasses[size])} />
      </div>
      {showText && (
        <span className={cn("text-xl tracking-tight font-black uppercase italic text-white", textClassName)}>
          SyncSpace
        </span>
      )}
    </div>
  );
}
