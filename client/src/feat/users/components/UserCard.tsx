import { MessageSquare, User, AtSign, Briefcase, Clock } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

import { cn } from "@/lib/utils"
import { usePresenceStore } from "@/app/stores/presence.store";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
  };
  onMessage?: () => void;
  onViewProfile?: () => void;
}

export default function UserCard({
  user,
  onMessage,
  onViewProfile,
}: UserCardProps) {
  const online = usePresenceStore((state) => state.onlineUsers.has(user._id));
  const fallbackInitial = user.name?.charAt(0)?.toUpperCase() ?? "?";
  const displayUsername = user.username || user.name?.toLowerCase().replace(/\s/g, '');

  return (
    <Card className="w-[320px] overflow-hidden border border-border/30 bg-popover/95 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-5">
        
        {/* Avatar & Status (Removed negative margins, standard sizing) */}
        <div className="relative mb-4 inline-flex">
          <Avatar className="h-16 w-16 rounded-full border border-border/10 bg-muted/50 shadow-sm">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-[18px] font-medium text-foreground">
              {fallbackInitial}
            </AvatarFallback>
          </Avatar>
          
          {/* Status Indicator */}
          <div className={cn(
            "absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-popover transition-colors duration-300",
            online ? "bg-emerald-500" : "bg-muted-foreground/40"
          )} />
        </div>

        {/* User Identity */}
        <div className="mb-4 flex flex-col gap-0.5">
          <h2 className="text-[17px] font-semibold tracking-tight text-foreground/95">
            {user.name}
          </h2>
          <div className="flex items-center gap-1 text-[13.5px] text-muted-foreground/70">
            <AtSign size={12} strokeWidth={2.5} />
            <span>{displayUsername}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/15 border-transparent">
            Pro Member
          </Badge>
          <Badge variant="outline" className="rounded-md border-border/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <span className={cn(
              "mr-1.5 inline-block h-1.5 w-1.5 rounded-full", 
              online ? "bg-emerald-500" : "bg-muted-foreground/50"
            )} />
            {online ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Workspace-style Meta Info */}
        <div className="mb-6 space-y-2.5 rounded-xl bg-muted/30 p-3 border border-border/30">
          <div className="flex items-center gap-2.5 text-[12.5px] text-muted-foreground">
            <Briefcase size={14} className="text-muted-foreground/60" />
            <span className="font-medium">Software Engineer</span>
          </div>
          <div className="flex items-center gap-2.5 text-[12.5px] text-muted-foreground">
            <Clock size={14} className="text-muted-foreground/60" />
            <span className="font-medium">Local time: 10:42 AM</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onMessage && (
            <Button
              type="button"
              onClick={onMessage}
              className="h-9 flex-1 rounded-xl bg-primary text-[13px] font-medium text-primary-foreground shadow-none transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={onViewProfile}
            className={cn(
              "h-9 rounded-xl bg-muted/50 text-[13px] font-medium text-foreground shadow-none transition-colors hover:bg-muted active:scale-[0.98]",
              onMessage ? "w-10 px-0" : "flex-1"
            )}
          >
            <User className={cn("h-4 w-4 text-muted-foreground", !onMessage && "mr-2")} />
            {!onMessage && "View Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}