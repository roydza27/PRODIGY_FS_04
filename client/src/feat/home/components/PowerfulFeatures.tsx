import { Zap, Building2, LayoutList, Shield, Users, Paperclip, Target, Search } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "Real-time collaboration", desc: "Sub-50ms message delivery ensures you're always perfectly synced." },
  { icon: Building2, title: "Team workspaces", desc: "Isolated environments for different organizations or clients." },
  { icon: LayoutList, title: "Organized channels", desc: "Structure discussions logically with public and private rooms." },
  { icon: Shield, title: "Permissions", desc: "Granular access controls based on roles and clearance levels." },
  { icon: Users, title: "Presence", desc: "Live indicators show who is online, away, or deeply focused." },
  { icon: Paperclip, title: "File sharing", desc: "Drag, drop, and securely share assets directly in chat." },
  { icon: Target, title: "Productivity", desc: "Slash commands, keyboard shortcuts, and deep integrations." },
  { icon: Search, title: "Search", desc: "Vector-powered global search to find anything instantly." },
];

export default function PowerfulFeatures() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
                Advanced Capabilities
            </div>
            <h2 className="mb-8 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                Powerful features <br className="hidden sm:block" />
                for <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">power users.</span>
            </h2>
        </div>

        <div className="grid gap-x-16 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex flex-col gap-6 text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/[0.08] bg-white/[0.02] text-violet-400 shadow-xl transition-all group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110 ring-1 ring-white/5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">{feat.title}</h3>
                  <p className="text-base font-medium leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


