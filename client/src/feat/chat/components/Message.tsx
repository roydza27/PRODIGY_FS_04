import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  IconArrowBackUp,
  IconDots,
  IconMessageCircle,
  IconMoodSmile,
  IconCopy,
  IconEdit,
  IconTrash
} from "@tabler/icons-react";

import UserCardPopover from "@/feat/users/components/UserCardPopover";

import { cn } from "@/lib/utils";
import { MessageStatus } from "../types/message.types";
import MessageStatusIndicator from "./MessageStatusIndicator";

interface MessageProps {
  author: {
    _id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
  };

  content: string;
  timestamp: Date;

  isGroupStart?: boolean;
  isContinuation?: boolean;
  isDM?: boolean;
  isCurrentUser?: boolean;
  status?: MessageStatus;
}

export default function Message({
  author,
  content,
  timestamp,
  isGroupStart = true,
  isDM = false,
  isCurrentUser = false,
  status = MessageStatus.SENT,
}: MessageProps) {
  if (isDM) {
    return (
      <motion.div
        initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "group relative flex w-full px-6 transition-all text-left duration-300", 
          isGroupStart ? "mt-6" : "mt-1",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Message Bubble Container - NO AVATAR RENDERED */}
        <div
          className={cn(
            "flex max-w-[70%] flex-col",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          {isGroupStart && !isCurrentUser && (
            <span className="mb-1.5 ml-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
              {author.name}
            </span>
          )}

          <div
            className={cn(
              "relative group/bubble overflow-hidden rounded-[22px] px-5 py-3 transition-all duration-300",
              isCurrentUser
                ? "bg-primary text-primary-foreground shadow-[0_8px_16px_-4px_rgba(var(--primary),0.2)] rounded-tr-none"
                : "bg-muted/50 text-foreground border border-border/20 backdrop-blur-sm rounded-tl-none",
              !isGroupStart && (isCurrentUser ? "rounded-tr-[22px]" : "rounded-tl-[22px]"),
              "hover:shadow-xl hover:scale-[1.01]"
            )}
          >
            <div className="relative">
              <p className="whitespace-pre-wrap break-words pr-14 text-[15px] font-medium leading-relaxed selection:bg-white/20">
                {content}
              </p>

              <div
                className={cn(
                  "absolute bottom-0 right-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter opacity-0 transition-opacity group-hover/bubble:opacity-60",
                  isCurrentUser
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{format(timestamp, "h:mm a")}</span>
                {isCurrentUser && (
                  <MessageStatusIndicator 
                    status={status} 
                    className={cn(
                      "transition-all duration-300",
                      status === MessageStatus.SEEN ? "opacity-100" : ""
                    )}
                  />
                )}
              </div>
            </div>
            
            {/* Inner Glow for Own Messages */}
            {isCurrentUser && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            )}
          </div>
        </div>

        {/* Floating Action Bar (Discord Style) */}
        <div className={cn(
          "absolute -top-5 z-20 hidden items-center gap-0.5 rounded-xl border border-border/50 bg-card/90 p-1 shadow-2xl backdrop-blur-xl transition-all animate-in zoom-in-95 group-hover:flex",
          isCurrentUser ? "right-10" : "left-10"
        )}>
          <HeaderAction icon={<IconMoodSmile size={16} stroke={2.5} />} label="React" />
          <HeaderAction icon={<IconArrowBackUp size={16} stroke={2.5} />} label="Reply" />
          <div className="mx-1 h-3 w-[1px] bg-border" />
          <HeaderAction icon={<IconCopy size={16} stroke={2.5} />} label="Copy" />
          {isCurrentUser && (
            <>
              <HeaderAction icon={<IconEdit size={16} stroke={2.5} />} label="Edit" />
              <HeaderAction icon={<IconTrash size={16} stroke={2.5} />} label="Delete" variant="destructive" />
            </>
          )}
          <div className="mx-1 h-3 w-[1px] bg-border" />
          <HeaderAction icon={<IconDots size={16} stroke={2.5} />} label="More" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex w-full gap-5 px-8 transition-all duration-200",
        isGroupStart ? "mt-8 py-2" : "py-0.5",
        "hover:bg-muted/20"
      )}
    >
      {/* Action Bar */}
      <div className="absolute -top-5 right-10 z-20 hidden items-center gap-0.5 rounded-xl border border-border/50 bg-card/90 p-1 shadow-2xl backdrop-blur-xl group-hover:flex">
        <HeaderAction icon={<IconMoodSmile size={18} stroke={2} />} label="React" />
        <HeaderAction icon={<IconArrowBackUp size={18} stroke={2} />} label="Reply" />
        <HeaderAction icon={<IconCopy size={18} stroke={2} />} label="Copy" />
        <div className="mx-1 h-4 w-[1px] bg-border" />
        <HeaderAction icon={<IconDots size={18} stroke={2} />} label="More" />
      </div>

      {/* Avatar / Timestamp */}
      <div className="flex w-12 shrink-0 justify-center">
        {isGroupStart ? (
          <UserCardPopover user={author}>
            <button
              type="button"
              className="relative rounded-2xl outline-none ring-primary/20 transition-all focus-visible:ring-4 hover:scale-105 active:scale-95"
            >
              <Avatar className="h-12 w-12 rounded-2xl shadow-md border-2 border-background">
                <AvatarImage
                  src={author.avatarUrl}
                  alt={author.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 font-black text-primary text-sm">
                  {author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </UserCardPopover>
        ) : (
          <div className="opacity-0 transition-opacity group-hover:opacity-100 mt-1">
            <span className="font-black text-[10px] text-muted-foreground/30 tracking-tighter uppercase">
              {format(timestamp, "HH:mm")}
            </span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="min-w-0 flex-1">
        {isGroupStart && (
          <div className="mb-1.5 flex items-baseline gap-3">
            <UserCardPopover user={author}>
              <button
                type="button"
                className="cursor-pointer text-[16px] font-black text-foreground/90 transition-colors hover:text-primary hover:underline underline-offset-4 decoration-2"
              >
                {author.name}
              </button>
            </UserCardPopover>
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
              {format(timestamp, "h:mm a")}
            </span>
          </div>
        )}

        <div className="relative text-left">
          <p className="whitespace-pre-wrap break-words text-[15px] font-medium leading-relaxed text-foreground/80 selection:bg-primary/20">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HeaderAction({ 
  icon, 
  label, 
  variant = "default" 
}: { 
  icon: React.ReactNode, 
  label: string, 
  variant?: "default" | "destructive" 
}) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: variant === "destructive" ? "hsl(var(--destructive)/0.1)" : "hsl(var(--muted))" }}
      whileTap={{ scale: 0.95 }}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 active:scale-95",
        variant === "destructive" ? "text-destructive hover:text-destructive" : "text-muted-foreground/60 hover:text-foreground"
      )}
    >
      {icon}
    </motion.button>
  );
}