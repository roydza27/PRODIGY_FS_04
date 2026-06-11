import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUsers } from "@tabler/icons-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useRoom } from "@/feat/rooms/hooks/useRoom";
import { useRoomMessages } from "../hooks/useRoomMessages";
import { useSocketRoom } from "../hooks/useSocketRoom";

import ChatHeader from "../components/ChatHeader";
import RoomIntro from "../components/RoomIntro";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";
import { MemberSidebar } from "@/shared/components/workspace/member-sidebar";

import { PageLayout } from "@/shared/components/layout/PageLayout";
import { cn } from "@/lib/utils";

export default function RoomChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [showMembers, setShowMembers] = useState(true);

  const {
    activeWorkspace,
    isLoading: workspaceLoading,
  } = useActiveWorkspace();

  const workspaceId = activeWorkspace?._id;

  const {
    data: roomResponse,
    isLoading: roomLoading,
  } = useRoom(workspaceId, roomId);

  const {
    data: messages = [],
    isLoading: messagesLoading,
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
          memberCount={room.memberCount}
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
                        memberCount={room.memberCount}
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
