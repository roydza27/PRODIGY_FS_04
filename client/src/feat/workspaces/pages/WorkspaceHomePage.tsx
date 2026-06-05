import { Link } from "react-router-dom";
import { Hash, Users, MessageSquare } from "lucide-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useGetRooms } from "@/feat/rooms/api/room.queries";
import CreateRoomDialog from "@/feat/rooms/components/CreateRoomDialog";

export default function WorkspaceHomePage() {
  const { activeWorkspace } = useActiveWorkspace();

  const workspaceId = activeWorkspace?._id;

  const {
    data: rooms = [],
    isLoading,
  } = useGetRooms(
    workspaceId ?? "",
    !!workspaceId
  );

  const textChannels = rooms.filter(
    (room) => room.type === "text"
  ).length;

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-5xl p-8">
        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Hash className="h-7 w-7 text-primary" />
              </div>

              <h1 className="mb-2 text-4xl font-bold">
                {activeWorkspace?.name ?? "Workspace"}
              </h1>

              <p className="max-w-2xl text-muted-foreground">
                {activeWorkspace?.description ??
                  "Collaborate with your team using dedicated rooms and channels."}
              </p>
            </div>

            <CreateRoomDialog />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Rooms
            </div>

            <p className="text-3xl font-bold">
              {rooms.length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              Members
            </div>

            <p className="text-3xl font-bold">
              {activeWorkspace?.memberCount ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              Text Channels
            </div>

            <p className="text-3xl font-bold">
              {textChannels}
            </p>
          </div>
        </div>

        {/* Rooms */}
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Available Rooms
          </h2>

          {isLoading ? (
            <p className="text-muted-foreground">
              Loading rooms...
            </p>
          ) : rooms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground">
                No rooms created yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <Link
                  key={room._id}
                  to={`/w/${activeWorkspace?._id}/rooms/${room._id}`}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">
                        #{room.name}
                      </p>

                      {room.description && (
                        <p className="text-sm text-muted-foreground">
                          {room.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-sm text-muted-foreground">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}