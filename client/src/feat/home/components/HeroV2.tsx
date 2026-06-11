import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Hash } from "lucide-react";

export default function HeroV2() {
  return (
    <section className="relative overflow-hidden bg-[#090909] pt-32 pb-16 md:pt-48 md:pb-24 lg:pt-56 lg:pb-32">
      {/* Background Glows */}
      <div className="absolute left-0 top-0 h-[600px] w-full max-w-[800px] bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        
        {/* Left Content Area */}
        <div className="text-left z-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            SyncSpace 2.0 is live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8 max-w-3xl text-5xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]"
          >
            The workspace <br />
            for teams that <br />
            build the <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-12 max-w-xl text-lg font-medium py-4 leading-relaxed text-zinc-400 sm:text-xl md:leading-relaxed"
          >
            One place for your entire team. Organize discussions, manage projects, 
            and collaborate in real-time without ever switching context.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-start gap-4 sm:flex-row"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full rounded-2xl bg-white px-10 text-sm font-bold text-black hover:bg-zinc-200 shadow-xl shadow-white/5 active:scale-95 transition-all">
                Start for free
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 w-full rounded-2xl border-white/[0.08] bg-white/[0.03] px-10 text-sm font-bold text-white hover:bg-white/[0.08] backdrop-blur-md transition-all">
                Book a demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Interactive Hero Mockup (Right Side) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative mt-20 lg:mt-0 px-4 sm:px-0"
        >
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-violet-500/20 via-transparent to-indigo-500/20 blur-3xl opacity-50" />
          
          <div className="relative rounded-[2.5rem] border border-white/[0.08] bg-[#111111] shadow-2xl overflow-hidden flex flex-col sm:flex-row text-left ring-1 ring-white/5">
            {/* Mockup Sidebar */}
            <div className="hidden sm:flex w-48 flex-col border-r border-white/[0.05] bg-[#161616] p-5">
              <div className="mb-8 flex items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-black text-white shadow-inner text-sm">A</div>
                <div className="font-bold tracking-tight text-white text-sm">Acme Corp</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 px-2 mb-4">Channels</div>
                {['general', 'engineering', 'design', 'marketing'].map((ch, i) => (
                  <div key={ch} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold tracking-tight transition-all ${i === 1 ? 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'}`}>
                    <Hash className="h-3.5 w-3.5" /> {ch}
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup Chat Area */}
            <div className="flex-1 bg-[#0d0d0d] p-6 sm:p-8 flex flex-col min-h-[400px]">
              <div className="border-b border-white/[0.05] pb-6 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold tracking-tight text-white text-lg">
                  <Hash className="h-4 w-4 text-zinc-600" /> engineering
                </div>
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-[#0d0d0d] bg-indigo-500 z-30" />
                  <div className="h-8 w-8 rounded-full border-2 border-[#0d0d0d] bg-pink-500 z-20" />
                  <div className="h-8 w-8 rounded-full border-2 border-[#0d0d0d] bg-emerald-500 z-10" />
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <MockMessage name="Sarah" time="10:24 AM" color="bg-indigo-500" text="Just pushed the new caching layer to production! 🚀" />
                <MockMessage name="Royal" time="10:26 AM" color="bg-emerald-500" text="Seeing a 40% latency drop on the dashboard. Incredible work." />
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="flex items-center gap-3 pt-6"
                >
                  <div className="flex gap-1.5 bg-white/[0.05] rounded-full px-4 py-2 border border-white/[0.08]">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }}/>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Alex is typing...</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 -bottom-6 hidden lg:flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#1a1a1a]/95 p-5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold tracking-tight text-white">Zero Latency</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-0.5">Sub-50ms delivery</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}


function MockMessage({ name, time, color, text }: { name: string, time: string, color: string, text: string }) {
  return (
    <div className="flex gap-5">
      <div className={`h-10 w-10 shrink-0 rounded-xl ${color} flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-white/10`}>
        {name[0]}
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-bold text-white tracking-tight">{name}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{time}</span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  )
}

