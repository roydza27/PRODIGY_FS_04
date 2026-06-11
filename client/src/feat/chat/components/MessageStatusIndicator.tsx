import { motion } from "framer-motion";
import { IconCheck, IconChecks, IconClock } from "@tabler/icons-react";
import { MessageStatus } from "../types/message.types";
import { cn } from "@/lib/utils";

interface MessageStatusIndicatorProps {
  status: MessageStatus;
  className?: string;
}

export default function MessageStatusIndicator({
  status,
  className,
}: MessageStatusIndicatorProps) {
  if (status === MessageStatus.SENDING) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-white/50", className)}
      >
        <IconClock size={12} stroke={3} className="animate-pulse" />
      </motion.div>
    );
  }

  if (status === MessageStatus.SENT) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-white/50", className)}
      >
        <IconCheck size={14} stroke={3} />
      </motion.div>
    );
  }

  const isSeen = status === MessageStatus.SEEN;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        color: isSeen ? "rgb(168 85 247)" : "rgba(255, 255, 255, 0.5)" // violet-500
      }}
      transition={{ 
        duration: 0.25,
        ease: "easeOut"
      }}
      className={cn(className)}
    >
      <IconChecks 
        size={16} 
        stroke={3} 
        className={cn(
          "transition-colors duration-300",
          isSeen ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" : "text-white/50"
        )} 
      />
    </motion.div>
  );
}
