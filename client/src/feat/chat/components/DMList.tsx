import { useNavigate, useParams } from "react-router-dom";

import { useConversations } from "../hooks/useConversations";
import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";

import { cn } from "@/lib/utils";
import { PresenceStatus } from "@/shared/components/ui/presence-status";

export default function DMList() {
  const navigate = useNavigate();

  const { conversationId } = useParams();

  const { activeWorkspace } = useActiveWorkspace();

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const onlineUsers = usePresenceStore((state) => state.onlineUsers);

  const {
    data: conversations = [],
    isLoading,
  } = useConversations();

  const getOtherParticipant = (
    participants: any[]
  ) => {
    if (!participants || !Array.isArray(participants)) return null;

    return (
      participants.find(
        (participant) =>
          participant._id !== currentUser?.id &&
          participant._id !== (currentUser as any)?._id
      ) ?? participants[0]
    );
  };

  return (
    <section className="mb-6">
      <div className="group mb-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground/60 hover:text-foreground/80 transition-colors cursor-default">
            Direct Messages
          </span>
          {!isLoading && conversations.length > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground/40 ml-1">
              ({conversations.length})
            </span>
          )}
        </div>
      </div>

      <div className="space-y-0.5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="mx-2 h-10 animate-pulse rounded-lg bg-muted/20"
            />
          ))
        ) : conversations.length === 0 ? (
          <div className="px-4 py-6 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/5 mx-2">
            <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed">
              No recent messages.<br />
              Start a conversation to see it here.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const other =
              getOtherParticipant(
                conversation.participants
              );

            if (!other) return null;

            const isActive =
              conversationId === conversation._id;

            const online = other ? onlineUsers.has(other._id) : false;

            return (
              <button
                key={conversation._id}
                onClick={() =>
                  navigate(
                    `/dm/${conversation._id}`
                  )
                }
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                )}
              >
                <div className="relative shrink-0">
                  <div className="relative h-8 w-8">
                    {other.avatarUrl ? (
                      <img
                        src={other.avatarUrl}
                        alt={other.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#313338] text-[13px] font-medium text-muted-foreground uppercase">
                        {other.name.charAt(0)}
                      </div>
                    )}
                    <PresenceStatus 
                      online={online} 
                      size="sm" 
                      className="absolute -bottom-0.5 -right-0.5" 
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start min-w-0">
                  <span className={cn(
                    "truncate text-[15px] leading-tight transition-colors",
                    isActive ? "font-semibold text-white" : "font-medium"
                  )}>
                    {other.name}
                  </span>
                  <span className="truncate text-[12px] font-medium text-muted-foreground/60">
                    {online ? "Online" : "Offline"}
                  </span>
                </div>

                {isActive && (
                  <div className="absolute -left-2 h-8 w-1 rounded-r-full bg-white" />
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
