import { Hash, Plus, Settings, MessageSquare, Send } from "lucide-react";

export default function WorkspacePreview() {
  return (
    <div className="relative group/preview">
      <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111113] shadow-2xl transition-all duration-500 group-hover/preview:border-violet-500/20">
        {/* Mock Title Bar */}
        <div className="h-10 border-b border-white/5 bg-[#141416] flex items-center px-6 gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
        </div>

        <div className="flex h-[460px]">
          {/* Sidebar */}
          <div className="w-56 border-r border-white/5 bg-[#141416]/50 p-5 hidden sm:block">
            <div className="mb-8 flex items-center justify-between">
                <div className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center text-[10px]">DT</div>
                    Development Team
                </div>
                <Settings className="h-4 w-4 text-zinc-600" />
            </div>

            <div className="space-y-1 text-sm font-medium">
              {[
                "general",
                "frontend",
                "backend",
                "design",
                "random",
              ].map((room) => (
                <div
                  key={room}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors ${
                    room === "frontend" 
                      ? "bg-violet-600/10 text-violet-400" 
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                  }`}
                >
                  <Hash className={`h-4 w-4 ${room === "frontend" ? "text-violet-400" : "text-zinc-600"}`} />
                  {room}
                </div>
              ))}
              <div className="pt-4 px-3 flex items-center gap-2 text-zinc-600 text-xs hover:text-zinc-400 cursor-pointer">
                <Plus className="h-3 w-3" />
                Add channel
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-1 flex-col bg-[#111113]">
            <div className="border-b border-white/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-zinc-500" />
                <h3 className="font-bold text-white tracking-tight">
                    frontend
                </h3>
              </div>
              <div className="flex items-center gap-4 text-zinc-500">
                <MessageSquare className="h-4 w-4" />
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="flex-1 space-y-6 p-6 overflow-hidden">
              <Message
                name="Royal"
                text="Workspace APIs are completed."
                color="bg-violet-500"
                delay="0"
              />

              <Message
                name="Sarah"
                text="Frontend integration started 🚀"
                color="bg-indigo-500"
                delay="150"
              />

              <Message
                name="Alex"
                text="UI review looks great. Let's merge."
                color="bg-purple-500"
                delay="300"
              />

              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400/80 animate-pulse pt-2">
                <div className="flex gap-0.5">
                    <div className="h-1 w-1 rounded-full bg-violet-400" />
                    <div className="h-1 w-1 rounded-full bg-violet-400" />
                    <div className="h-1 w-1 rounded-full bg-violet-400" />
                </div>
                Royal is typing...
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-5 mt-auto">
                <div className="h-12 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center px-4 justify-between">
                    <span className="text-sm text-zinc-600">Message #frontend</span>
                    <Send className="h-4 w-4 text-zinc-600" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism Overlay Badges */}
      <div className="absolute -right-8 top-12 rounded-[1.5rem] border border-white/10 bg-[#1a1a1d]/80 px-6 py-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-1000">
        <div className="text-2xl font-black text-white">
          12
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
          Active Members
        </div>
      </div>

      <div className="absolute -bottom-6 left-12 rounded-[1.5rem] border border-white/10 bg-[#1a1a1d]/80 px-6 py-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-1000 delay-300">
        <div className="text-2xl font-black text-white">
          8
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
          Synced Channels
        </div>
      </div>
    </div>
  );
}

function Message({
  name,
  text,
  color,
  delay
}: {
  name: string;
  text: string;
  color: string;
  delay: string;
}) {
  return (
    <div className={`flex gap-4 animate-in fade-in slide-in-from-left-4 duration-700`} style={{ transitionDelay: `${delay}ms` }}>
      <div className={`h-11 w-11 shrink-0 rounded-2xl ${color} flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-black/20`}>
        {name.charAt(0)}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-white tracking-tight">
                {name}
            </div>
            <span className="text-[10px] font-bold text-zinc-600">12:45 PM</span>
        </div>

        <div className="text-sm font-medium text-zinc-400 leading-relaxed">
          {text}
        </div>
      </div>
    </div>
  );
}