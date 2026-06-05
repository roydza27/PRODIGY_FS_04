import { Hash, Mic, Lock } from "lucide-react";

export default function RoomsPreview() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl">
      <div className="mb-6 text-lg font-semibold text-white">
        Development Workspace
      </div>

      <div className="space-y-2">
        <Room
          icon={<Hash size={16} />}
          name="general"
          active
        />

        <Room
          icon={<Hash size={16} />}
          name="announcements"
        />

        <Room
          icon={<Hash size={16} />}
          name="frontend"
        />

        <Room
          icon={<Hash size={16} />}
          name="backend"
        />

        <Room
          icon={<Lock size={16} />}
          name="leadership"
        />

        <Room
          icon={<Mic size={16} />}
          name="Voice Meeting"
        />
      </div>
    </div>
  );
}

function Room({
  icon,
  name,
  active,
}: {
  icon: React.ReactNode;
  name: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
      flex items-center gap-3 rounded-xl px-3 py-3
      ${
        active
          ? "bg-violet-500/15 text-white"
          : "text-zinc-400 hover:bg-white/5"
      }
      `}
    >
      {icon}
      {name}
    </div>
  );
}