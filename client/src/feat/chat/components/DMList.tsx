import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { useConversations } from "../hooks/useConversations";
import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";

import { cn } from "@/lib/utils";
import { PresenceStatus } from "@/shared/components/ui/presence-status";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";

export default function DMList() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  useActiveWorkspace();

  const currentUser = useAuthStore((state) => state.user);
  const onlineUsers = usePresenceStore((state) => state.onlineUsers);
  const typingUsers = usePresenceStore((state) => state.typingUsers);

  const { data: conversations = [], isLoading } = useConversations();

  const getOtherParticipant = (participants: { _id: string; name: string; avatarUrl?: string }[]) => {
    if (!participants || !Array.isArray(participants)) return null;
    const currentUserId = currentUser?.id;
    return participants.find((p) => p._id !== currentUserId) ?? participants[0];
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
            <div key={index} className="mx-2 h-10 animate-pulse rounded-lg bg-muted/20" />
          ))
        ) : conversations.length === 0 ? (
          <div className="px-4 py-6 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/5 mx-2">
            <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed">
              No recent messages.<br />
              Start a conversation to see it here.
            </p>
          </div>
        ) : (
          conversations.map((conversation: Record<string, unknown> & { _id: string; participants: { _id: string; name: string; avatarUrl?: string }[]; unreadCount?: number; lastMessage?: Record<string, unknown> & { senderId: { _id: string }, createdAt: string, text: string } }) => {
            const other = getOtherParticipant(conversation.participants);
            if (!other) return null;

            const isActive = conversationId === conversation._id;
            const isOnline = onlineUsers.has(other._id);
            const isTyping = typingUsers[conversation._id]?.has(other._id);
            const unreadCount = conversation.unreadCount || 0;
            const lastMessage = conversation.lastMessage;

            return (
              <button
                key={conversation._id}
                onClick={() => navigate(`/dm/${conversation._id}`)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300",
                  isActive
                    ? "bg-brand/10 text-foreground shadow-[0_0_20px_rgba(139,92,246,0.05)] ring-1 ring-white/10"
                    : unreadCount > 0 
                      ? "bg-white/[0.03] text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                )}
              >
                <div className="relative shrink-0">
                  <div className="relative h-10 w-10">
                    {other.avatarUrl ? (
                      <img
                        src={other.avatarUrl}
                        alt={other.name}
                        className="h-full w-full rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted/40 text-[14px] font-bold text-muted-foreground uppercase shadow-inner">
                        {other.name.charAt(0)}
                      </div>
                    )}
                    <PresenceStatus 
                      online={isOnline} 
                      size="sm" 
                      className="absolute -bottom-0.5 -right-0.5 border-2 border-[#0B0B0D]" 
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start min-w-0">
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className={cn(
                      "truncate text-[14px] leading-tight transition-colors",
                      isActive ? "font-bold text-primary" : unreadCount > 0 ? "font-bold text-foreground" : "font-semibold text-foreground/80"
                    )}>
                      {other.name}
                    </span>
                    {lastMessage && (
                      <span className="text-[10px] font-medium text-muted-foreground/40 whitespace-nowrap">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex w-full items-center justify-between gap-2 mt-0.5">
                    <div className="flex-1 min-w-0">
                      {isTyping ? (
                        <span className="flex items-center gap-1 text-[12px] font-bold text-primary animate-pulse">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          typing...
                        </span>
                      ) : (
                        <p className={cn(
                          "truncate text-[12px] leading-tight text-left",
                          isActive ? "text-primary/60" : unreadCount > 0 ? "font-bold text-foreground/90" : "font-medium text-muted-foreground/50"
                        )}>
                          {lastMessage ? (
                            <>
                              {lastMessage.senderId._id === currentUser?.id ? "You: " : ""}
                              {lastMessage.text}
                            </>
                          ) : (
                            "No messages yet"
                          )}
                        </p>
                      )}
                    </div>
                    
                    {unreadCount > 0 && !isActive && (
                      <div className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-lg shadow-primary/20">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute -left-3 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_10px_#8b5cf6]" />
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
