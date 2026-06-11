import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PresenceStatusProps {
  online: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export const PresenceStatus = ({
  online,
  size = "md",
  className,
  showText = false,
}: PresenceStatusProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const ringSizeClasses = {
    sm: "border-[1.5px]",
    md: "border-[2px]",
    lg: "border-[2.5px]",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {online ? (
            <motion.div
              key="online"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "rounded-full bg-emerald-500",
                sizeClasses[size],
                ringSizeClasses[size],
                "border-background"
              )}
            >
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40" />
            </motion.div>
          ) : (
            <motion.div
              key="offline"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "rounded-full bg-muted-foreground/30",
                sizeClasses[size],
                ringSizeClasses[size],
                "border-background"
              )}
            />
          )}
        </AnimatePresence>
      </div>
      
      {showText && (
        <span className={cn(
          "text-[12px] font-black uppercase tracking-widest transition-colors duration-300",
          online ? "text-emerald-500" : "text-muted-foreground/40"
        )}>
          {online ? "Active Now" : "Currently Offline"}
        </span>
      )}
    </div>
  );
};
