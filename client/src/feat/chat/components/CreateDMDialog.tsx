import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useGetWorkspaceMembers } from "@/feat/workspaces/api/workspace.queries";
import { getOrCreateDM } from "../api/conversation.api";
import { useAuthStore } from "@/app/stores/auth.store";
import type { WorkspaceMember, WorkspaceUser } from "@/feat/workspaces/types/workspace.types";

interface CreateDMDialogProps {
  workspaceId: string;
  trigger: React.ReactNode;
}

export default function CreateDMDialog({ workspaceId, trigger }: CreateDMDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  const { data: members = [], isLoading } = useGetWorkspaceMembers(workspaceId, open);

  const filteredMembers = (members as WorkspaceMember[]).filter((member) => {
    const user = typeof member.userId === "string" ? null : (member.userId as WorkspaceUser);
    if (!user) return false;
    
    // Don't show current user
    const currentUserId = currentUser?.id;
    if (user._id === currentUserId) return false;

    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();
    const searchLower = search.toLowerCase();

    return name.includes(searchLower) || email.includes(searchLower);
  });

  const handleStartDM = async (participantId: string) => {
    try {
      setIsCreating(true);
      const conversation = await getOrCreateDM(workspaceId, { participantId });
      
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setOpen(false);
      navigate(`/dm/${conversation._id}`);
    } catch (error) {
      console.error("Failed to start DM:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111113] border-white/5 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-white/5">
          <DialogTitle className="text-white">Direct Messages</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find or start a conversation"
              className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No members found
              </div>
            ) : (
              filteredMembers.map((member) => {
                const user = member.userId as WorkspaceUser;
                return (
                  <button
                    key={user._id}
                    disabled={isCreating}
                    onClick={() => handleStartDM(user._id)}
                    className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
