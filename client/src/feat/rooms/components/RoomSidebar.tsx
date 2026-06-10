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
    <section className="mb-4">
      {/* Header */}
      <div className="group mb-1 flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground/60 hover:text-foreground/80 transition-colors cursor-default">
            Text Channels
          </span>

          {!isLoading && rooms.length > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground/40 ml-1">
              ({rooms.length})
            </span>
          )}
        </div>

        {workspaceId && canManageRooms && (
          <CreateRoomDialog
            workspaceId={workspaceId}
            trigger={
              <button
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            }
          />
        )}
      </div>

      {/* Content */}
      <div className="space-y-0.5">
        {isLoading ? (
          <div className="space-y-1 mt-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="mx-2 h-8 animate-pulse rounded bg-muted/20"
              />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <EmptyRoomState />
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
      </div>
    </section>
  );
}