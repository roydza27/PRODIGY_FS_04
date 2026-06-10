import { Link } from "react-router-dom";
import { Hash, Users, MessageSquare } from "lucide-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useGetRooms } from "@/feat/rooms/api/room.queries";
import CreateRoomDialog from "@/feat/rooms/components/CreateRoomDialog";

import { PageLayout } from "@/shared/components/layout/PageLayout";

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
    <PageLayout variant="constrained">
      {/* Hero */}
      <div className="mb-8 rounded-3xl border border-white/5 bg-white/[0.02] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Hash className="h-7 w-7 text-primary" />
            </div>

            <h1 className="mb-2 text-4xl font-black tracking-tight text-white">
              {activeWorkspace?.name ?? "Workspace"}
            </h1>

            <p className="max-w-2xl text-muted-foreground font-medium">
              {activeWorkspace?.description ??
                "Collaborate with your team using dedicated rooms and channels."}
            </p>
          </div>

          <div className="shrink-0">
            <CreateRoomDialog
              workspaceId={workspaceId!}
              trigger={
                <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                  New Channel
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard 
          label="Channels" 
          value={rooms.length} 
          icon={<MessageSquare className="h-4 w-4" />} 
        />
        <StatCard 
          label="Members" 
          value={activeWorkspace?.memberCount ?? 0} 
          icon={<Users className="h-4 w-4" />} 
        />
        <StatCard 
          label="Active Conversations" 
          value={textChannels} 
          icon={<Hash className="h-4 w-4" />} 
        />
      </div>

      {/* Rooms */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6">
        <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
          Available Channels
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center bg-white/[0.01]">
            <p className="text-sm font-medium text-muted-foreground/40">
              No channels created yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {rooms.map((room) => (
              <Link
                key={room._id}
                to={`/w/${activeWorkspace?.slug}/rooms/${room._id}`}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-all hover:bg-white/[0.04] hover:border-white/10 group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground/40 group-hover:text-primary transition-colors">
                    <Hash className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-bold text-white group-hover:text-primary transition-colors">
                      {room.name}
                    </p>

                    {room.description && (
                      <p className="text-xs font-medium text-muted-foreground/60 line-clamp-1">
                        {room.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/30 uppercase tracking-widest group-hover:text-white transition-colors">
                  Open Chat
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
        {icon}
        {label}
      </div>
      <p className="text-3xl font-black text-white tracking-tight">
        {value}
      </p>
    </div>
  );
}