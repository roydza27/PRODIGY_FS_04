import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { 
  IconMoodSmile, 
  IconArrowBackUp, 
  IconDots, 
  IconMessageCircle 
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface MessageProps {
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: Date;
  isGroupStart?: boolean;
  isContinuation?: boolean;
}

export default function Message({ 
  author, 
  content, 
  timestamp, 
  isGroupStart = true,
  isContinuation = false 
}: MessageProps) {
  return (
    <div className={cn(
      "group relative flex w-full gap-4 px-6 transition-colors duration-200 hover:bg-zinc-800/30",
      isGroupStart ? "mt-4 py-1" : "py-0.5"
    )}>
      {/* Action Bar - Hidden by default, shows on hover */}
      <div className="absolute -top-4 right-6 z-10 hidden group-hover:flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-lg">
        <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <IconMoodSmile size={18} stroke={1.5} />
        </button>
        <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <IconArrowBackUp size={18} stroke={1.5} />
        </button>
        <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <IconMessageCircle size={18} stroke={1.5} />
        </button>
        <div className="mx-1 h-4 w-[1px] bg-border" />
        <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <IconDots size={18} stroke={1.5} />
        </button>
      </div>

      {/* Left Column: Avatar or Hover-Timestamp */}
      <div className="w-10 shrink-0 flex justify-center">
        {isGroupStart ? (
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
              {author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
              {format(timestamp, "HH:mm")}
            </span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 text-left">
        {isGroupStart && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-bold text-[15px] text-foreground hover:underline cursor-pointer decoration-2 underline-offset-2">
              {author.name}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground/70">
              {format(timestamp, "h:mm a")}
            </span>
          </div>
        )}
        
        <p className="text-[15px] leading-[1.6] text-foreground/90 whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
}
