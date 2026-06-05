import { Hash, Sparkles, Users, MessageSquareText } from "lucide-react";

interface Props {
  roomName: string;
  description?: string;
  memberCount?: number;
}

export default function RoomWelcomeCard({
  roomName,
  description,
  memberCount = 0,
}: Props) {
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-1 backdrop-blur-sm transition-all hover:border-white/20">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-50" />

      {/* Header */}
      <div className="relative flex items-start gap-4 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-inner">
          <Hash size={24} className="text-indigo-400" />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-white">#{roomName}</h3>
            <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              General
            </span>
          </div>
          <p className="leading-relaxed text-zinc-400 text-sm">
            {description || "Welcome to the channel. Start collaborating with your team."}
          </p>
        </div>
      </div>

      {/* Grid Features */}
      <div className="relative grid gap-3 px-5 pb-5 md:grid-cols-3">
        <FeatureCard 
          icon={<Users size={18} />} 
          title="Team Members" 
          value={`${memberCount.toLocaleString()} people`} 
          color="text-indigo-400" 
        />
        <FeatureCard 
          icon={<Sparkles size={18} />} 
          title="Start Creating" 
          value="Share your ideas" 
          color="text-violet-400" 
        />
        <FeatureCard 
          icon={<MessageSquareText size={18} />} 
          title="Keep Organized" 
          value="Threads & replies" 
          color="text-emerald-400" 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <h4 className="text-sm font-medium text-white">{title}</h4>
      <p className="text-xs text-zinc-500">{value}</p>
    </div>
  );
}