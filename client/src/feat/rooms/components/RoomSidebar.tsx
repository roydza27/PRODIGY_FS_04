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
    <section className="mb-6">
      {/* Header */}
      <div className="group mb-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Channels
          </span>

          {!isLoading && rooms.length > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-muted/50 px-1 text-[9px] font-black text-muted-foreground">
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
                className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="h-4 w-4" strokeWidth={3} />
              </button>
            }
          />
        )}
      </div>

      {/* Content */}
      <div className="px-2">
        {isLoading ? (
          <div className="space-y-1 mt-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="mx-2 h-11 animate-pulse rounded-xl bg-muted/20"
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