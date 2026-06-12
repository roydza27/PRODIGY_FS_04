import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconUser, 
  IconDots,
  IconMoodSmile,
  IconShieldCheck
} from "@tabler/icons-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useConversationMessages } from "../hooks/useConversationMessages";
import { useSocketDM } from "../hooks/useSocketDM";
import { useConversation } from "../hooks/useConversation";

import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";
import { useWorkspaceStore } from "@/feat/workspaces/store/workspace.store";

import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";
import { cn } from "@/lib/utils";

import { PageLayout } from "@/shared/components/layout/PageLayout";

const EMPTY_SET = new Set<string>();

export default function DMPage() {
  const { conversationId } = useParams<{ conversationId: string }>();

  const {
    activeWorkspace,
    isLoading: workspaceLoading,
  } = useActiveWorkspace();

  const setActiveWorkspaceId = useWorkspaceStore(
    (state) => state.setActiveWorkspaceId
  );

  const workspaceId = activeWorkspace?._id;

  const currentUser = useAuthStore((state) => state.user);
  const onlineUsers = usePresenceStore((state) => state.onlineUsers);
  const lastSeenMap = usePresenceStore((state) => state.lastSeen);

  const {
    data: conversation,
    isLoading: conversationLoading,
  } = useConversation(conversationId, workspaceId);

  // Sync workspace from conversation if not already set
  useEffect(() => {
    if (conversation?.workspaceId && conversation.workspaceId !== workspaceId) {
      setActiveWorkspaceId(conversation.workspaceId);
    }
  }, [conversation?.workspaceId, workspaceId, setActiveWorkspaceId]);

  const {
    data: messages = [],
    isLoading: messagesLoading,
  } = useConversationMessages(conversationId);

  const typingUsers = usePresenceStore((state) => 
    (conversationId ? state.typingUsers[conversationId] : null) ?? EMPTY_SET
  );

  useSocketDM(conversation?.workspaceId || workspaceId, conversationId);

  if (!conversationId) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background text-muted-foreground">
        Invalid conversation link
      </PageLayout>
    );
  }

  if (workspaceLoading || conversationLoading || messagesLoading) {
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
            Establishing Secure Link
          </span>
        </motion.div>
      </PageLayout>
    );
  }

  if (!conversation) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background text-muted-foreground">
        Conversation not found
      </PageLayout>
    );
  }

  const currentUserId = currentUser?.id || (currentUser as Record<string, unknown>)?._id;

  const otherParticipant =
    conversation.participants.find(
      (participant) => participant._id !== currentUserId
    ) ?? conversation.participants[0];

  if (!otherParticipant) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background text-muted-foreground">
        No participant found
      </PageLayout>
    );
  }

  const online = otherParticipant ? onlineUsers.has(otherParticipant._id) : false;
  const lastSeenAt = otherParticipant ? (lastSeenMap[otherParticipant._id] || otherParticipant.lastSeenAt) : undefined;
  const isOtherTyping = typingUsers.has(otherParticipant?._id || "");

  return (
    <PageLayout variant="full" className="relative flex h-full flex-col overflow-hidden bg-background selection:bg-primary/20">
      <ChatHeader
        roomName={otherParticipant.name || "Unknown"}
        avatarUrl={otherParticipant.avatarUrl}
        username={otherParticipant.username}
        isDM
        isOnline={online}
        lastSeenAt={lastSeenAt}
      />

      {/* Note: Removed the outer overflow-y-auto here. 
        MessageList now handles its own scrolling.
      */}
      <div className="relative min-h-0 flex-1 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="flex flex-col pb-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={conversationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center px-6 py-24 text-center"
                >
                  {/* Profile Hero Section */}
                  <div className="group relative mb-10">
                    <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-primary via-blue-500 to-purple-600 opacity-10 blur-3xl transition-all duration-700 group-hover:opacity-20 group-hover:scale-110" />
                    
                    <div className="relative">
                      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[40px] border-4 border-background bg-card shadow-2xl transition-all duration-500 group-hover:rounded-[32px] group-hover:scale-105 group-hover:rotate-2">
                        {otherParticipant.avatarUrl ? (
                          <img
                            src={otherParticipant.avatarUrl}
                            alt={otherParticipant.name || "Avatar"}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-5xl font-black bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent">
                            {otherParticipant.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        )}
                      </div>
                      
                      {/* Status Ring */}
                      <div className={cn(
                        "absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl border-4 border-background shadow-xl transition-all duration-500 group-hover:scale-110",
                        online ? "bg-emerald-500" : "bg-muted-foreground/30"
                      )}>
                        {online && <div className="absolute inset-0 animate-ping rounded-xl bg-emerald-500/40" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-5xl font-black tracking-tight text-foreground drop-shadow-sm">
                        {otherParticipant.name || "Unknown User"}
                      </h2>
                      <IconShieldCheck className="text-primary h-6 w-6 mt-1" stroke={2.5} />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                        @{otherParticipant.username || otherParticipant.name?.toLowerCase().replace(/\s/g, '') || "user"}
                      </p>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <div className={cn(
                        "flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest",
                        online ? "text-emerald-500" : "text-muted-foreground/40"
                      )}>
                        {online ? "Active Now" : "Currently Offline"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-12 max-w-lg space-y-6">
                    <p className="text-lg font-medium leading-relaxed text-muted-foreground/80">
                      This marks the beginning of your private connection with <span className="font-black text-foreground">{otherParticipant.name}</span>. Share ideas, files, and collaborate in a secure space.
                    </p>
                    
                    <div className="flex items-center justify-center gap-6">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
                        Encrypted Channel
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                  </div>

                  {/* Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                    <IntroCard 
                      icon={<IconUser size={20} />} 
                      label="View Profile" 
                      description="Member since 2024"
                    />
                    <IntroCard 
                      icon={<IconDots size={20} />} 
                      label="More Actions" 
                      description="Block or report"
                    />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                  >
                    <button className="group relative flex items-center gap-3 rounded-[20px] bg-primary px-10 py-4 text-[15px] font-black text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
                      <IconMoodSmile className="transition-transform group-hover:rotate-12" stroke={2.5} />
                      Say Hello 👋
                      <div className="absolute inset-0 rounded-[20px] bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          ) : (
          <div className="flex-1 min-h-0">
            <MessageList 
              messages={messages} 
              isDM={true} 
              isTyping={isOtherTyping}
              typingUsers={isOtherTyping ? [otherParticipant] : []}
            />
          </div>
        )}
      </div>


      <MessageComposer 
        workspaceId={conversation.workspaceId}
        conversationId={conversationId} 
        placeholderName={otherParticipant.name}
      />
    </PageLayout>
  );
}

function IntroCard({ icon, label, description }: { icon: React.ReactNode, label: string, description: string }) {
  return (
    <motion.button 
      whileHover={{ y: -4, backgroundColor: "hsl(var(--muted)/0.5)" }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center gap-3 rounded-3xl bg-muted/30 p-5 border border-border/50 transition-all text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-inner text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[13px] font-black text-foreground tracking-tight">{label}</p>
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">{description}</p>
      </div>
    </motion.button>
  );
}