import { useParams } from "react-router-dom";

import RoomSidebar from "../components/RoomSidebar";

import { useRoom } from "../hooks/useRoom";

import ChatHeader from "@/feat/chat/components/ChatHeader";
import MessageList from "@/feat/chat/components/MessageList";

export default function RoomPage() {
  const { workspaceId, roomId } = useParams();

  const { data, isLoading } = useRoom(
    workspaceId,
    roomId
  );

  const room = data?.data;

  return (
    <div className="flex h-full">

      <div className="flex flex-1 flex-col">
        {isLoading && <p>Loading...</p>}

        {room && (
          <>
            <ChatHeader room={room} />

            <div className="flex-1 overflow-hidden">
              <MessageList />
            </div>
          </>
        )}
      </div>
    </div>
  );
}