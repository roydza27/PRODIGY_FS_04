import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Create Workspace", desc: "Set up your secure environment in seconds." },
  { num: "02", title: "Invite Team", desc: "Bring everyone on board with simple invite links." },
  { num: "03", title: "Create Channels", desc: "Establish the structure for your projects." },
  { num: "04", title: "Start Collaborating", desc: "Experience the speed of true real-time sync." },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48 overflow-hidden border-y border-white/[0.05]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
                Smooth Onboarding
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                How it works.
            </h2>
        </div>

        <div className="relative">
          {/* Timeline connecting line */}
          <div className="absolute top-12 left-0 right-0 hidden h-px bg-white/[0.05] md:block" />
          
          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative group text-left"
              >
                <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-white/[0.08] bg-[#111111] text-3xl font-black italic text-violet-500 shadow-2xl relative z-10 transition-all group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white ring-1 ring-white/5">
                  {step.num}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">{step.title}</h3>
                  <p className="text-base font-medium leading-relaxed text-zinc-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


