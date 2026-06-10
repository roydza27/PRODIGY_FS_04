import { MessageSquare, Building2, Hash, Zap } from "lucide-react";

const stats = [
  {
    value: "15K+",
    label: "Messages Sent",
    icon: MessageSquare,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    value: "120+",
    label: "Workspaces",
    icon: Building2,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    value: "350+",
    label: "Rooms Created",
    icon: Hash,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    value: "99.9%",
    label: "Uptime",
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function StatsSection() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="group relative">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight text-white">
                      {stat.value}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}