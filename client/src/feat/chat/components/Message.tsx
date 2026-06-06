import { format } from "date-fns";
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
} from "@tabler/icons-react";

import UserCardPopover from "@/feat/users/components/UserCardPopover";

import { cn } from "@/lib/utils";

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
}

export default function Message({
  author,
  content,
  timestamp,
  isGroupStart = true,
  isDM = false,
  isCurrentUser = false,
}: MessageProps) {
  if (isDM) {
    return (
      <div
        className={cn(
          "group relative flex w-full gap-3 px-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
          isGroupStart ? "mt-4" : "mt-1",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar (Other user only) */}
        {!isCurrentUser && (
          <div className="flex w-8 shrink-0 flex-col justify-end pb-1">
            {isGroupStart ? (
              <UserCardPopover user={author}>
                <Avatar className="h-8 w-8 rounded-full border-2 border-background shadow-sm transition-transform hover:scale-110 active:scale-95">
                  <AvatarImage src={author.avatarUrl} alt={author.name} />
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                    {author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </UserCardPopover>
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>
        )}

        {/* Message Bubble Container */}
        <div
          className={cn(
            "flex max-w-[75%] flex-col",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          {isGroupStart && !isCurrentUser && (
            <span className="mb-1 ml-1 text-[11px] font-bold text-muted-foreground/70">
              {author.name}
            </span>
          )}

          <div
            className={cn(
              "relative rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md",
              isCurrentUser
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none",
              !isGroupStart && (isCurrentUser ? "rounded-tr-2xl" : "rounded-tl-2xl")
            )}
          >
            
<div className="relative">
  <p className="whitespace-pre-wrap break-words pr-12 text-[14.5px] leading-relaxed">
    {content}
  </p>

  <span
    className={cn(
      "absolute bottom-0 right-0 text-[10px]",
      isCurrentUser
        ? "text-primary-foreground/60"
        : "text-muted-foreground/60"
    )}
  >
    {format(timestamp, "h:mm a")}
  </span>
</div>
          </div>
        </div>

        {/* Floating Action Bar (for DMs) */}
        <div className={cn(
          "absolute -top-4 z-10 hidden items-center gap-0.5 rounded-full border border-border bg-card p-1 shadow-xl transition-all animate-in zoom-in-95 group-hover:flex",
          isCurrentUser ? "right-4" : "left-12"
        )}>
          <HeaderAction icon={<IconMoodSmile size={16} stroke={2} />} label="React" />
          <HeaderAction icon={<IconArrowBackUp size={16} stroke={2} />} label="Reply" />
          <div className="mx-1 h-3 w-px bg-border" />
          <HeaderAction icon={<IconDots size={16} stroke={2} />} label="More" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex w-full gap-4 px-6 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isGroupStart ? "mt-5 py-1.5" : "py-0.5",
        "hover:bg-muted/40"
      )}
    >
      {/* Action Bar */}
      <div className="absolute -top-4 right-6 z-10 hidden items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-md group-hover:flex">
        <HeaderAction icon={<IconMoodSmile size={18} stroke={1.5} />} label="Add Reaction" />
        <HeaderAction icon={<IconArrowBackUp size={18} stroke={1.5} />} label="Reply" />
        <HeaderAction icon={<IconMessageCircle size={18} stroke={1.5} />} label="Forward" />
        <div className="mx-1 h-4 w-px bg-border" />
        <HeaderAction icon={<IconDots size={18} stroke={1.5} />} label="More Actions" />
      </div>

      {/* Avatar / Timestamp */}
      <div className="flex w-10 shrink-0 justify-center">
        {isGroupStart ? (
          <UserCardPopover user={author}>
            <button
              type="button"
              className="relative rounded-lg outline-none ring-primary/20 transition-all focus-visible:ring-4"
            >
              <Avatar className="h-10 w-10 rounded-lg shadow-sm">
                <AvatarImage
                  src={author.avatarUrl}
                  alt={author.name}
                />
                <AvatarFallback className="rounded-lg bg-primary/10 font-bold text-primary">
                  {author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </UserCardPopover>
        ) : (
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <span className="mt-1 block font-mono text-[10px] text-muted-foreground/60">
              {format(timestamp, "HH:mm")}
            </span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="min-w-0 flex-1">
        {isGroupStart && (
          <div className="mb-1 flex items-baseline gap-2">
            <UserCardPopover user={author}>
              <button
                type="button"
                className="cursor-pointer text-[15px] font-bold text-foreground transition-colors hover:text-primary hover:underline underline-offset-2"
              >
                {author.name}
              </button>
            </UserCardPopover>
            <span className="text-[11px] font-medium text-muted-foreground/60">
              {format(timestamp, "h:mm a")}
            </span>
          </div>
        )}

        <div className="relative text-left">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/90 selection:bg-primary/20">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeaderAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button 
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-95"
    >
      {icon}
    </button>
  );
}