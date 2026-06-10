import { FolderKanban, MessageSquare, Users, Pin, Bell, Activity } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: FolderKanban, title: "Projects", desc: "Organize by initiative" },
  { icon: MessageSquare, title: "Conversations", desc: "Threaded discussions" },
  { icon: Users, title: "Teams", desc: "Role-based groups" },
  { icon: Pin, title: "Pinned Items", desc: "Important resources" },
  { icon: Bell, title: "Notifications", desc: "Smart alerts" },
  { icon: Activity, title: "Activity Feed", desc: "Global overview" },
];

export default function EverythingInOne() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
                Core Primitives
            </div>
            <h2 className="mb-8 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                Everything <br /> in one place.
            </h2>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 sm:text-xl">
                Stop hunting for links and context. SyncSpace brings all your work primitives 
                into a single, unified interface designed for deep focus.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col items-start justify-center gap-8 overflow-hidden rounded-[2.5rem] border border-white/[0.05] bg-white/[0.02] p-10 text-left transition-all hover:border-violet-500/30 hover:bg-white/[0.04] ring-1 ring-white/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white transition-all group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white shadow-xl shadow-black/20 ring-1 ring-white/5">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight text-white">{item.title}</h3>
                  <p className="text-base font-medium leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
                
                {/* Subtle Glow Effect on Hover */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/10 blur-[80px] transition-all group-hover:bg-violet-600/20" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


