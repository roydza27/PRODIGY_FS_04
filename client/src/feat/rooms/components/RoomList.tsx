import RoomItem from "./RoomItem";

import type { Room } from "../types/room.types";

interface RoomListProps {
  rooms: Room[];
  selectedRoomId?: string;
  onSelect?: (roomId: string) => void;
}

export default function RoomList({
  rooms,
  selectedRoomId,
  onSelect,
}: RoomListProps) {
  return (
    <div className="px-2">
      <div className="space-y-0.5">
        {rooms.map((room) => (
          <RoomItem
            key={room._id}
            room={room}
            isActive={selectedRoomId === room._id}
            onClick={() => onSelect?.(room._id)}
          />
        ))}
      </div>
    </div>
  );
}