import { useParams } from "react-router-dom";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useRoom } from "@/feat/rooms/hooks/useRoom";
import { useRoomMessages } from "../hooks/useRoomMessages";
import { useSocketRoom } from "../hooks/useSocketRoom";

import ChatHeader from "../components/ChatHeader";
import RoomIntro from "../components/RoomIntro";
import MessageList from "../components/MessageList";
import MessageComposer from "../components/MessageComposer";

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
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <span className="text-sm font-medium text-muted-foreground">
            Loading channel...
          </span>
        </div>
      </div>
    );
  }

  if (!workspaceId || !room) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-muted-foreground">
        Room not found
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <ChatHeader roomName={room.name} />

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
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

        <MessageComposer />
      </div>
    </div>
  );
}