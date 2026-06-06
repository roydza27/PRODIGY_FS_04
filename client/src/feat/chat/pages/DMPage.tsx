import { useParams } from "react-router-dom";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useConversation } from "../hooks/useConversation";
import { useConversationMessages } from "../hooks/useConversationMessages";
import { useSocketDM } from "../hooks/useSocketDM";
import { useAuthStore } from "@/app/stores/auth.store";

import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";

export default function DMPage() {
  const { conversationId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const { activeWorkspace, isLoading: workspaceLoading } = useActiveWorkspace();
  const workspaceId = activeWorkspace?._id;

  const { data: conversation, isLoading: conversationLoading } = useConversation(workspaceId, conversationId);
  const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(conversationId);

  // Subscribe to real-time updates
  useSocketDM(workspaceId, conversationId);

  if (workspaceLoading || conversationLoading || messagesLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">Loading conversation...</span>
        </div>
      </div>
    );
  }

  if (!workspaceId || !conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-muted-foreground">
        Conversation not found
      </div>
    );
  }

  const otherParticipant = conversation.participants.find(
    (p: any) => p._id !== currentUser?._id
  ) || conversation.participants[0];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <ChatHeader roomName={otherParticipant.name} isDM={true} />

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col pb-4">
          <div className="px-6 py-10 flex flex-col items-center text-center">
             <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white mb-4 overflow-hidden border-4 border-white/5 shadow-xl">
                {otherParticipant.avatarUrl ? (
                  <img src={otherParticipant.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  otherParticipant.name.charAt(0)
                )}
             </div>
             <h2 className="text-2xl font-bold text-white mb-1">{otherParticipant.name}</h2>
             <p className="text-zinc-500 max-w-md">
                This is the very beginning of your direct message history with <span className="text-zinc-300 font-medium">{otherParticipant.name}</span>.
             </p>
          </div>

          <div className="mt-4">
            <MessageList messages={messages} />
          </div>
        </div>
      </div>

      {/* Input section stays at the bottom */}
      <MessageComposer />
    </div>
  );
}
