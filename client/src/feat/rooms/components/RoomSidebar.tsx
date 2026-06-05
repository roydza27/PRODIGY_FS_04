import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import RoomList from "./RoomList";
import EmptyRoomState from "./EmptyRoomState";
import CreateRoomDialog from "./CreateRoomDialog";

import { useRooms } from "../hooks/useRooms";
import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useWorkspaceMember } from "@/feat/workspaces/hooks/useWorkspaceMember";

export default function RoomSidebar() {
  const navigate = useNavigate();

  const { workspaceSlug, roomId } = useParams();

  const { activeWorkspace } = useActiveWorkspace();

  const {
    isAdmin,
    isOwner,
    isLoading: isMemberLoading,
  } = useWorkspaceMember();

  const workspaceId = activeWorkspace?._id;

  const canManageRooms =
    !isMemberLoading && (isAdmin || isOwner);

  const {
    data: rooms = [],
    isLoading,
  } = useRooms(workspaceId);

  return (
<section className="mb-5">
  {/* Header */}
  <div className="group mb-3 flex items-center justify-between px-3">
    <div className="flex items-center gap-2">
      <div className="h-1 w-1 rounded-full bg-emerald-400" />

      <span
        className="
          text-[10px]
          font-medium
          uppercase
          tracking-[0.24em]
          text-zinc-500
        "
      >
        Rooms
      </span>

      {!isLoading && rooms.length > 0 && (
        <span
          className="
            flex
            h-5 min-w-5
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            px-1.5
            text-[10px]
            font-medium
            text-muted-foreground
            backdrop-blur-sm">
          {rooms.length}
        </span>
      )}
    </div>

    {workspaceId && canManageRooms && (
      <CreateRoomDialog
        workspaceId={workspaceId}
        trigger={
          <button
            type="button"
            className="
              flex h-7 w-7 items-center justify-center
              rounded-md
              text-muted-foreground
              opacity-0
              transition-all duration-200
              group-hover:opacity-100
              hover:bg-white/5
              hover:text-foreground
            "
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      />
    )}
  </div>

  {/* Content */}
  {isLoading ? (
    <div className="space-y-1.5 px-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="
            h-9
            animate-pulse
            rounded-lg
            bg-white/[0.03]
          "
        />
      ))}
    </div>
  ) : rooms.length === 0 ? (
    <div className="px-2">
      <EmptyRoomState />
    </div>
  ) : (
    <RoomList
      rooms={rooms}
      selectedRoomId={roomId}
      onSelect={(selectedRoomId) =>
        navigate(
          `/w/${workspaceSlug}/rooms/${selectedRoomId}`
        )
      }
    />
  )}
</section>
  );
}