import { motion } from "framer-motion";

export default function WhySyncSpace() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-32 items-center text-left">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
                Unified Ecosystem
            </div>

            <h2 className="mb-8 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1]">
              One place for your <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">entire team.</span>
            </h2>
            
            <div className="space-y-6 text-lg font-medium leading-relaxed text-zinc-400 sm:text-xl">
              <p>
                Instead of switching between multiple fragmented tools, emails, and isolated chat apps, 
                SyncSpace unifies your organization in a single cohesive flow.
              </p>
              <p>
                Organize discussions logically, manage complex projects effortlessly, and collaborate 
                in a single, dedicated workspace designed specifically for high-performance teams.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Abstract visual representation of "fragmented" vs "unified" */}
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full border border-white/[0.03] bg-white/[0.01] shadow-inner" />
              <div className="absolute inset-8 rounded-full border border-white/[0.05] bg-white/[0.02]" />
              <div className="absolute inset-16 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-md flex items-center justify-center shadow-[0_0_100px_rgba(139,92,246,0.15)]">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-20 w-20 rounded-[2.5rem] bg-violet-600 shadow-2xl flex items-center justify-center ring-4 ring-violet-400/20"
                >
                  <div className="h-7 w-7 border-[3px] border-white rounded-lg" />
                </motion.div>
              </div>

              {/* Orbiting nodes representing fragmented tools being pulled in */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-blue-500/40 blur-[4px] shadow-lg" />
                <div className="absolute bottom-1/4 right-0 h-4 w-4 rounded-full bg-pink-500/40 blur-[4px] shadow-lg" />
                <div className="absolute top-1/3 -left-2 h-6 w-6 rounded-full bg-emerald-500/40 blur-[4px] shadow-lg" />
              </motion.div>
              
              {/* Secondary Orbit */}
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-12">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-3 w-3 rounded-full bg-violet-500/30 blur-[2px]" />
                <div className="absolute top-1/4 left-0 h-4 w-4 rounded-full bg-indigo-500/30 blur-[2px]" />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
