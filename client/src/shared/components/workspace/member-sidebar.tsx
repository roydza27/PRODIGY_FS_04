import * as React from "react";
import { usePresenceStore } from "@/app/stores/presence.store";
import { useGetWorkspaceMembers } from "@/feat/workspaces/api/workspace.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { PresenceStatus } from "@/shared/components/ui/presence-status";
import { cn } from "@/lib/utils";
import { formatLastSeen } from "@/utils/date";

interface MemberSidebarProps {
  workspaceId: string;
}

export function MemberSidebar({ workspaceId }: MemberSidebarProps) {
  const { data: members = [], isLoading } = useGetWorkspaceMembers(workspaceId);
  const onlineUsers = usePresenceStore((state) => state.onlineUsers);
  const lastSeenMap = usePresenceStore((state) => state.lastSeen);

  const sortedMembers = React.useMemo(() => {
    return [...members].sort((a, b) => {
      const aId = typeof a.userId === "string" ? a.userId : (a.userId as any)?._id;
      const bId = typeof b.userId === "string" ? b.userId : (b.userId as any)?._id;
      
      const aOnline = onlineUsers.has(aId);
      const bOnline = onlineUsers.has(bId);

      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      
      const aName = (a.userId as any)?.name || "";
      const bName = (b.userId as any)?.name || "";
      return aName.localeCompare(bName);
    });
  }, [members, onlineUsers]);

  if (isLoading) {
    return (
      <div className="flex h-full w-64 flex-col border-l border-border/30 bg-background/50 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-muted/20 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted/20" />
              <div className="h-4 flex-1 animate-pulse rounded bg-muted/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const onlineCount = members.filter(m => {
    const id = typeof m.userId === "string" ? m.userId : (m.userId as any)?._id;
    return onlineUsers.has(id);
  }).length;

  return (
    <div className="flex h-full w-64 flex-col border-l border-border/30 bg-background/50">
      <div className="p-4 border-b border-border/30">
        <h3 className="text-[12px] font-black uppercase tracking-widest text-muted-foreground/60">
          Members — {onlineCount}/{members.length}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <div className="space-y-1 text-left">
          {sortedMembers.map((member) => {
            const user = member.userId as any;
            const userId = user?._id || user;
            const isOnline = onlineUsers.has(userId);
            const lastSeenAt = lastSeenMap[userId] || user?.lastSeenAt;

            return (
              <div
                key={member._id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-muted/50"
              >
                <div className="relative shrink-0">
                  <Avatar className="h-8 w-8 rounded-full border border-border/20">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="text-[11px] font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <PresenceStatus 
                    online={isOnline} 
                    size="sm" 
                    className="absolute -bottom-0.5 -right-0.5 border-2 border-background" 
                  />
                </div>

                <div className="flex flex-1 flex-col min-w-0">
                  <span className={cn(
                    "truncate text-[14px] font-medium leading-tight",
                    isOnline ? "text-foreground" : "text-muted-foreground/60"
                  )}>
                    {user?.name || "Unknown User"}
                  </span>
                  <span className="truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground/30">
                    {isOnline ? "Online" : formatLastSeen(lastSeenAt).replace("Last seen ", "")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
