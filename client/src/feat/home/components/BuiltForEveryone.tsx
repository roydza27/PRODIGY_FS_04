import { Code2, PenTool, TrendingUp, Rocket, GraduationCap, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  { icon: Code2, title: "Developers", desc: "Integrate with GitHub, deploy alerts, and syntax highlighting built-in." },
  { icon: PenTool, title: "Designers", desc: "Share high-res assets, Figma links, and get visual feedback instantly." },
  { icon: TrendingUp, title: "Marketing", desc: "Coordinate campaigns, share analytics, and align on messaging." },
  { icon: Rocket, title: "Startups", desc: "Scale your culture from day one with organized communication." },
  { icon: GraduationCap, title: "Students", desc: "Group projects and study sessions in a focused environment." },
  { icon: Globe2, title: "Communities", desc: "Host large open-source or private communities with granular roles." }
];

export default function BuiltForEveryone() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48 border-b border-white/[0.05]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
                User Personas
            </div>
            <h2 className="mb-8 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                Built for <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">everyone.</span>
            </h2>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 sm:text-xl">
                SyncSpace adapts to how your team works, providing the right tools 
                for every discipline across your organization.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((aud, i) => {
            const Icon = aud.icon;
            return (
              <motion.div
                key={aud.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col items-start gap-10 rounded-[2.5rem] border border-white/[0.05] bg-[#111111] p-10 text-left transition-all hover:border-violet-500/30 hover:bg-[#141414] ring-1 ring-white/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white transition-all group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white shadow-xl ring-1 ring-white/5">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">{aud.title}</h3>
                  <p className="text-base font-medium leading-relaxed text-zinc-500">{aud.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


