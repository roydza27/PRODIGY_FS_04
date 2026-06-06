import { useParams } from "react-router-dom";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useConversationMessages } from "../hooks/useConversationMessages";
import { useSocketDM } from "../hooks/useSocketDM";
import { useConversation } from "../hooks/useConversation";

import { useAuthStore } from "@/app/stores/auth.store";

import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";

export default function DMPage() {
  const { conversationId } = useParams();

  const {
    activeWorkspace,
    isLoading: workspaceLoading,
  } = useActiveWorkspace();

  const workspaceId = activeWorkspace?._id;

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const {
    data: conversation,
    isLoading: conversationLoading,
  } = useConversation(conversationId);

  const {
    data: messages = [],
    isLoading: messagesLoading,
  } = useConversationMessages(conversationId);

  useSocketDM(workspaceId, conversationId);

  if (
    workspaceLoading ||
    conversationLoading ||
    messagesLoading
  ) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">
            Loading conversation...
          </span>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-muted-foreground">
        Conversation not found
      </div>
    );
  }

  const otherParticipant =
    conversation.participantIds.find(
      (participant) =>
        participant._id !== currentUser?.id &&
        participant._id !== (currentUser as any)?._id
    ) ?? conversation.participantIds[0];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <ChatHeader
        roomName={otherParticipant.name}
        avatarUrl={otherParticipant.avatarUrl}
        username={otherParticipant.username}
        isDM
      />

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col pb-4">
          {/* DM Intro Screen */}
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="group relative mb-8">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary to-blue-600 opacity-10 blur-2xl transition-all group-hover:opacity-20" />
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted text-4xl font-bold shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {otherParticipant.avatarUrl ? (
                  <img
                    src={otherParticipant.avatarUrl}
                    alt={otherParticipant.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {otherParticipant.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute bottom-2 right-2 h-7 w-7 rounded-full border-4 border-background bg-emerald-500 shadow-lg" />
            </div>

            <h2 className="mb-2 text-4xl font-black tracking-tight text-foreground">
              {otherParticipant.name}
            </h2>
            <p className="mb-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/50">
              @{otherParticipant.username || otherParticipant.name.toLowerCase().replace(/\s/g, '')}
            </p>

            <div className="mb-10 max-w-sm space-y-4">
              <p className="text-[16px] leading-relaxed text-muted-foreground">
                This is the very beginning of your conversation with <span className="font-bold text-foreground">{otherParticipant.name}</span>.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground/40">
                <div className="h-px w-8 bg-border/50" />
                <span>PROFESSIONAL SPACE</span>
                <div className="h-px w-8 bg-border/50" />
              </div>
              <p className="text-sm text-muted-foreground/60 italic">
                "Be respectful and keep conversations professional."
              </p>
            </div>

            <div className="flex gap-3">
              <button className="rounded-2xl bg-muted/50 px-8 py-3 text-[13px] font-bold transition-all hover:bg-muted hover:scale-105 active:scale-95">
                View Profile
              </button>
              {messages.length === 0 && (
                <button className="rounded-2xl bg-primary px-8 py-3 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
                  Say Hello 👋
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <MessageList messages={messages} isDM={true} />
          </div>
        </div>
      </div>

      <MessageComposer conversationId={conversationId} />
    </div>
  );
}