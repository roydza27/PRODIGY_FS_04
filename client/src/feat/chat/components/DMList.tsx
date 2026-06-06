import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useConversations } from "../hooks/useConversations";
import { useAuthStore } from "@/app/stores/auth.store";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";

import CreateDMDialog from "./CreateDMDialog";

import { cn } from "@/lib/utils";

export default function DMList() {
  const navigate = useNavigate();

  const { conversationId } = useParams();

  const { activeWorkspace } = useActiveWorkspace();

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const {
    data: conversations = [],
    isLoading,
  } = useConversations();

  const getOtherParticipant = (
    participants: typeof conversations[number]["participantIds"]
  ) => {
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
      <div className="group mb-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Direct Messages
          </span>
          {!isLoading && conversations.length > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-muted/50 px-1 text-[9px] font-black text-muted-foreground">
              {conversations.length}
            </span>
          )}
        </div>

        <CreateDMDialog
          workspaceId={activeWorkspace?._id!}
          trigger={
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
            </button>
          }
        />
      </div>

      <div className="space-y-1 px-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="mx-2 h-11 animate-pulse rounded-xl bg-muted/20"
            />
          ))
        ) : conversations.length === 0 ? (
          <div className="px-4 py-3 text-center rounded-xl bg-muted/5 border border-dashed border-border/20 mx-2">
            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
              No recent DMs
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const other =
              getOtherParticipant(
                conversation.participantIds
              );

            const isActive =
              conversationId === conversation._id;

            return (
              <button
                key={conversation._id}
                onClick={() =>
                  navigate(
                    `/dm/${conversation._id}`
                  )
                }
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.05)] ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                  <div className="relative h-9 w-9">
                    {other.avatarUrl ? (
                      <img
                        src={other.avatarUrl}
                        alt={other.name}
                        className="h-full w-full rounded-xl object-cover shadow-sm ring-1 ring-border/20"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted text-xs font-black text-muted-foreground/60 ring-1 ring-border/20">
                        {other.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card shadow-sm transition-transform duration-300 group-hover:scale-110",
                      isActive ? "bg-emerald-500" : "bg-emerald-500/80"
                    )} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start min-w-0">
                  <span className={cn(
                    "truncate text-[14px] font-bold tracking-tight transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"
                  )}>
                    {other.name}
                  </span>
                  <span className={cn(
                    "truncate text-[10px] font-bold uppercase tracking-widest transition-colors",
                    isActive ? "text-primary/60" : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
                  )}>
                    Active now
                  </span>
                </div>

                {isActive && (
                  <div className="absolute right-0 h-6 w-1 rounded-l-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-in slide-in-from-right-1" />
                )}
                
                {/* Unread Indicator Placeholder */}
                {Math.random() > 0.8 && !isActive && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground shadow-lg shadow-primary/20 animate-in zoom-in">
                    1
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}