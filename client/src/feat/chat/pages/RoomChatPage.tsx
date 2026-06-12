import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUsers } from "@tabler/icons-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useRoom } from "@/feat/rooms/hooks/useRoom";
import { useRoomMessages } from "../hooks/useRoomMessages";
import { useSocketRoom } from "../hooks/useSocketRoom";
import { useGetWorkspaceMembers } from "@/feat/workspaces/api/workspace.queries";
import { usePresenceStore } from "@/app/stores/presence.store";

import ChatHeader from "../components/ChatHeader";
import RoomIntro from "../components/RoomIntro";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";
import { MemberSidebar } from "@/shared/components/workspace/member-sidebar";

import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

const EMPTY_SET = new Set<string>();

export default function RoomChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [showMembers, setShowMembers] = useState(typeof window !== "undefined" ? window.innerWidth >= 1280 : true);

  const {
    activeWorkspace,
    isLoading: workspaceLoading,
  } = useActiveWorkspace();

  const workspaceId = activeWorkspace?._id;

  const { data: members = [] } = useGetWorkspaceMembers(workspaceId || "");
  const typingUserIds = usePresenceStore((state) => 
    (roomId ? state.typingUsers[roomId] : null) ?? EMPTY_SET
  );

  const typingUsers = Array.from(typingUserIds)
    .map(id => {
       const member = (members as Array<Record<string, unknown> & { userId?: { _id: string; name: string; avatarUrl?: string } | string }>).find((m) => {
         const mUserId = typeof m.userId === "string" ? m.userId : m.userId?._id;
         return mUserId === id;
       });
       return typeof member?.userId === "object" ? member.userId : null;
    })
    .filter(Boolean);

  const {
    data: roomResponse,
    isLoading: roomLoading,
    error: roomError
  } = useRoom(workspaceId, roomId);

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError
  } = useRoomMessages(workspaceId, roomId);

  useSocketRoom(workspaceId, roomId);

  const room = roomResponse?.data;

  if (!roomId) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background text-muted-foreground">
        Invalid channel link
      </PageLayout>
    );
  }

  if (roomError || messagesError) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center min-h-[70vh] px-6">
        <div className="text-center space-y-5 max-w-sm">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <IconUsers size={24} strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[17px] font-semibold text-foreground">Channel Sync Error</h2>
            <p className="text-[13.5px] text-muted-foreground/70 leading-relaxed">We encountered a problem while synchronizing this channel. Please verify your connection.</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="h-9 rounded-xl bg-destructive hover:bg-destructive/90 px-5 text-[13px] font-medium transition-all"
          >
            Retry Connection
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (workspaceLoading || roomLoading || messagesLoading) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-xl border-4 border-primary/20 border-t-primary shadow-lg" />
            <div className="absolute inset-0 animate-pulse rounded-xl bg-primary/10 blur-xl" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/40 animate-pulse">
            Syncing Channel Data
          </span>
        </motion.div>
      </PageLayout>
    );
  }

  if (!workspaceId || !room) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background text-muted-foreground">
        Channel not found
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="full" className="relative flex flex-col h-full overflow-hidden bg-background selection:bg-primary/20">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] h-[30%] w-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[25%] w-[25%] rounded-full bg-emerald-500/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="relative flex h-[60px] items-center justify-between border-b border-border/30 bg-background px-4 z-40">
        <ChatHeader 
          roomName={room.name} 
          memberCount={room.memberCount || 0}
          isDM={false}
        />
        <button
          onClick={() => setShowMembers(!showMembers)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-muted/50",
            showMembers ? "text-primary bg-primary/10" : "text-muted-foreground/60"
          )}
          title={showMembers ? "Hide Members" : "Show Members"}
        >
          <IconUsers size={20} stroke={2} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 flex overflow-hidden">
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                <div className="flex flex-col pb-6">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={roomId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex flex-col items-center px-6 py-24 text-center"
                    >
                      <RoomIntro
                        roomName={room.name}
                        description={room.description}
                        isPrivate={room.isPrivate}
                        memberCount={room.memberCount || 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-0">
                <MessageList 
                  messages={messages} 
                  isDM={false} 
                  isTyping={typingUsers.length > 0}
                  typingUsers={typingUsers as Array<{ _id: string; name: string; avatarUrl?: string }>}
                />
              </div>
            )}
          </div>

          <MessageComposer 
            workspaceId={workspaceId}
            roomId={roomId} 
          />
        </div>

        {showMembers && workspaceId && (
          <MemberSidebar workspaceId={workspaceId} />
        )}
      </div>
    </PageLayout>
  );
}
