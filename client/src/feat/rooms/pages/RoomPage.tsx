import { useParams } from "react-router-dom";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useRooms } from "../hooks/useRooms";
import { useEffect, useState } from "react";
import { Hash, Loader2 } from "lucide-react";
import type { Room } from "../types";

export default function RoomPage() {
  const { roomId } = useParams<{ workspaceSlug: string; roomId: string }>();
  const { activeWorkspace } = useActiveWorkspace();
  const { rooms, fetchRooms, isLoading } = useRooms(activeWorkspace?._id);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (activeWorkspace?._id) {
      fetchRooms();
    }
  }, [activeWorkspace?._id, fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0 && roomId) {
      const room = rooms.find((r) => r._id === roomId);
      if (room) {
        setCurrentRoom(room);
      }
    }
  }, [rooms, roomId]);

  if (isLoading || !currentRoom) {
    return (
      <div className="flex h-full items-center justify-center bg-[#111113]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111113]">
      {/* Room Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-6">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-zinc-500" />
          <h2 className="font-semibold text-white">{currentRoom.name}</h2>
          {currentRoom.description && (
            <>
              <span className="text-zinc-600">|</span>
              <p className="text-sm text-zinc-400 truncate max-w-md">{currentRoom.description}</p>
            </>
          )}
        </div>
      </header>

      {/* Chat Area Placeholder */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="size-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
            <Hash className="h-8 w-8 text-zinc-500" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Welcome to #{currentRoom.name}!</h3>
            <p className="text-zinc-400 max-w-sm">
              This is the start of the #{currentRoom.name} channel. Messages are not implemented yet.
            </p>
          </div>
        </div>
      </div>
      
      {/* Message Input Placeholder */}
      <div className="p-4 bg-[#111113]">
        <div className="relative">
          <input 
            type="text" 
            placeholder={`Message #${currentRoom.name}`}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
