import { useParams } from "react-router-dom";

import RoomSidebar from "../components/RoomSidebar";

import { useRoom } from "../hooks/useRoom";

export default function RoomPage() {
  const { workspaceId, roomId } = useParams();

  const { data, isLoading } = useRoom(
    workspaceId,
    roomId
  );

  const room = data?.data;

  return (
    <div className="flex h-full">
      <RoomSidebar />

      <div className="flex-1 p-6">
        {isLoading && <p>Loading...</p>}

        {room && (
          <>
            <h1 className="text-2xl font-bold">
              {room.name}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {room.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}