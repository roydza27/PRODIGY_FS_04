import { Plus, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useConversations } from "../hooks/useConversations";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useAuthStore } from "@/app/stores/auth.store";
import CreateDMDialog from "./CreateDMDialog";
import { cn } from "@/lib/utils";

export default function DMList() {
  const navigate = useNavigate();
  const { workspaceSlug, conversationId } = useParams();
  const { activeWorkspace } = useActiveWorkspace();
  const currentUser = useAuthStore((state) => state.user);
  
  const workspaceId = activeWorkspace?._id;
  const { data: conversations = [], isLoading } = useConversations(workspaceId);

  const getOtherParticipant = (participants: any[]) => {
    return participants.find((p) => p._id !== currentUser?._id) || participants[0];
  };

  return (
    <section className="mb-5">
      {/* Header */}
      <div className="group mb-3 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-blue-400" />
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
            Direct Messages
          </span>
          {!isLoading && conversations.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-1.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
              {conversations.length}
            </span>
          )}
        </div>

        {workspaceId && (
          <CreateDMDialog
            workspaceId={workspaceId}
            trigger={
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white/5 hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            }
          />
        )}
      </div>

      {/* Content */}
      <div className="space-y-0.5 px-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-9 animate-pulse rounded-lg bg-white/[0.03]" />
          ))
        ) : conversations.length === 0 ? (
          <p className="px-3 text-[11px] text-zinc-500 italic">No recent DMs</p>
        ) : (
          conversations.map((conv) => {
            const other = getOtherParticipant(conv.participants);
            const isActive = conversationId === conv._id;

            return (
              <button
                key={conv._id}
                onClick={() => navigate(`/w/${workspaceSlug}/dm/${conv._id}`)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <div className="relative">
                  {other.avatarUrl ? (
                    <img src={other.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-bold text-white">
                      {other.name.charAt(0)}
                    </div>
                  )}
                  {/* Presence indicator (placeholder) */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-zinc-900 bg-emerald-500" />
                </div>
                <span className="truncate flex-1 text-left">{other.name}</span>
                {isActive && (
                   <div className="h-1 w-1 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
