import { useParams } from "react-router-dom";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useRoom } from "@/feat/rooms/hooks/useRoom";
import { useRoomMessages } from "../hooks/useRoomMessages";
import { useSocketRoom } from "../hooks/useSocketRoom";

import ChatHeader from "../components/ChatHeader";
import RoomIntro from "../components/RoomIntro";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";

import { PageLayout } from "@/shared/components/layout/PageLayout";

export default function RoomChatPage() {
  const { roomId } = useParams();

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

  if (
    workspaceLoading ||
    roomLoading ||
    messagesLoading
  ) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <span className="text-sm font-medium text-muted-foreground">
            Loading channel...
          </span>
        </div>
      </PageLayout>
    );
  }

  if (!workspaceId || !room) {
    return (
      <PageLayout variant="full" className="flex items-center justify-center bg-background text-muted-foreground">
        Room not found
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="full" className="flex flex-col overflow-hidden bg-background">
      <ChatHeader 
        roomName={room.name} 
        memberCount={room.memberCount}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex min-h-full flex-col">
            <RoomIntro
              roomName={room.name}
              description={room.description}
              isPrivate={room.isPrivate}
              memberCount={room.memberCount}
            />

            <MessageList messages={messages} />
          </div>
        </div>

        <MessageComposer roomId={roomId} />
      </div>
    </PageLayout>
  );
}