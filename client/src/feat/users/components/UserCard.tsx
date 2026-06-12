import { MessageSquare, User, AtSign } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

import { cn } from "@/lib/utils"
import { usePresenceStore } from "@/app/stores/presence.store";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
    bio?: string;
    statusMessage?: string;
  };
  onMessage?: () => void;
  onViewProfile?: () => void;
}

export default function UserCard({
  user,
  onMessage,
  onViewProfile,
}: UserCardProps) {
  const userId = user._id || (user as any).id;
  const online = usePresenceStore((state) => state.onlineUsers.has(userId));
  const fallbackInitial = user.name?.charAt(0)?.toUpperCase() ?? "?";
  const displayUsername = user.username || user.name?.toLowerCase().replace(/\s/g, '');

  return (
    <div className="w-[300px] overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-white/5 transition-all duration-300">
      {/* Banner */}
      <div className="h-16 w-full bg-gradient-to-r from-primary/80 via-primary to-primary-foreground/20">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative px-4 pb-4">
        {/* Avatar Section */}
        <div className="relative -mt-8 mb-3 inline-block">
          <div className="rounded-full bg-card p-[4px]">
            <Avatar className="h-16 w-16 border-none">
              <AvatarImage
                src={user.avatarUrl}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-[18px] font-bold text-primary">
                {fallbackInitial}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* Status Indicator */}
          <div className={cn(
            "absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-card transition-colors duration-300",
            online ? "bg-emerald-500" : "bg-zinc-500"
          )} />
        </div>

        {/* User Identity */}
        <div className="mb-4 space-y-0.5">
          <h2 className="text-[17px] font-bold leading-tight text-white">
            {user.name}
          </h2>
          <div className="flex items-center gap-1 text-[13px] text-zinc-400">
            <AtSign size={12} className="opacity-70" />
            <span>{displayUsername}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="rounded-lg bg-muted/40 p-3 shadow-inner">
          {/* Status Message */}
          {user.statusMessage && (
            <div className="mb-3 text-[13px] italic text-zinc-300 line-clamp-2">
              "{user.statusMessage}"
            </div>
          )}

          {/* About Me */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-500">About Me</h3>
            <p className="text-[12px] leading-relaxed text-zinc-300 line-clamp-3">
              {user.bio || "This user hasn't added a bio yet."}
            </p>
          </div>

          <Separator className="my-3 bg-white/5" />

          {/* Badges/Roles Placeholder */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-bold border-none">
              PRO
            </Badge>
            <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-bold border-none">
              STAFF
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {onMessage && (
            <Button
              type="button"
              onClick={onMessage}
              className="h-8 flex-1 rounded bg-primary text-[12px] font-bold text-primary-foreground shadow-none transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              <MessageSquare className="mr-2 h-3.5 w-3.5" />
              Message
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={onViewProfile}
            className={cn(
              "h-8 rounded text-[12px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors active:scale-[0.98]",
              onMessage ? "w-8 px-0" : "flex-1"
            )}
          >
            <User className={cn("h-3.5 w-3.5", !onMessage && "mr-2")} />
            {!onMessage && "View Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}