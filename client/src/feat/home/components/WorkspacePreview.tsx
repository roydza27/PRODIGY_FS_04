import { Hash } from "lucide-react";

export default function WorkspacePreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#18181B] shadow-2xl">
        <div className="flex h-[500px]">
          <div className="w-52 border-r border-white/10 bg-[#141416] p-4">
            <div className="mb-6 font-medium text-white">
              Development Team
            </div>

            <div className="space-y-3 text-sm">
              {[
                "general",
                "frontend",
                "backend",
                "design",
                "random",
              ].map((room) => (
                <div
                  key={room}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-400 hover:bg-white/5"
                >
                  <Hash className="h-4 w-4" />
                  {room}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="border-b border-white/10 p-4">
              <h3 className="font-medium text-white">
                # frontend
              </h3>
            </div>

            <div className="flex-1 space-y-5 p-6">
              <Message
                name="Royal"
                text="Workspace APIs are completed."
              />

              <Message
                name="Sarah"
                text="Frontend integration started 🚀"
              />

              <Message
                name="Alex"
                text="UI review looks great."
              />

              <div className="text-sm text-violet-400 animate-pulse">
                Royal is typing...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-5 top-8 rounded-2xl border border-white/10 bg-[#1a1a1d] px-4 py-3 shadow-xl">
        <div className="text-xl font-bold text-white">
          12
        </div>
        <div className="text-xs text-zinc-500">
          Users Online
        </div>
      </div>

      <div className="absolute -bottom-5 left-8 rounded-2xl border border-white/10 bg-[#1a1a1d] px-4 py-3 shadow-xl">
        <div className="text-xl font-bold text-white">
          8
        </div>
        <div className="text-xs text-zinc-500">
          Active Rooms
        </div>
      </div>
    </div>
  );
}

function Message({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 rounded-full bg-violet-500/20" />

      <div>
        <div className="font-medium text-white">
          {name}
        </div>

        <div className="text-zinc-400">
          {text}
        </div>
      </div>
    </div>
  );
}