import { Hash, Mic, Shield, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import WorkspacePreview from "./WorkspacePreview";

export default function Experience() {
  return (
    <section className="bg-[#090909] py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-32">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Workspace Experience
            </div>

            <h2 className="mb-8 text-5xl font-black tracking-tight text-white lg:text-7xl leading-[1.1]">
              Organized to <br />
              <span className="text-zinc-600">perfection.</span>
            </h2>

            <p className="mb-12 max-w-lg text-xl font-medium leading-relaxed text-zinc-500">
              Stop losing conversations in chaotic threads. SyncSpace organizes your 
              team into isolated workspaces and logical channels that make sense.
            </p>

            <div className="space-y-6">
                <ExpItem 
                    icon={<Hash className="h-5 w-5" />}
                    title="Public Channels"
                    desc="Open discussions for entire teams and projects."
                />
                <ExpItem 
                    icon={<Shield className="h-5 w-5" />}
                    title="Private Rooms"
                    desc="Sensitive conversations held behind locked doors."
                />
                <ExpItem 
                    icon={<Users className="h-5 w-5" />}
                    title="Presence Sync"
                    desc="Always know who's available and ready to work."
                />
            </div>

            <div className="mt-12">
                <button className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white hover:text-violet-400 transition-colors group">
                    Explore Workspace Features
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative group">
                <div className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <WorkspacePreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ExpItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-violet-400 shadow-xl">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm font-medium text-zinc-500">{desc}</p>
            </div>
        </div>
    )
}
