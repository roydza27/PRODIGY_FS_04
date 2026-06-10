import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, MessageSquareMore, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import WorkspacePreview from "./WorkspacePreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-24 pb-20 lg:pt-32 lg:pb-32">
      {/* Cinematic Background */}
      <div className="absolute left-1/2 top-0 h-[800px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-400 backdrop-blur-md"
        >
          <Zap className="h-3.5 w-3.5 fill-violet-400" />
          The future of team collaboration
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-8 max-w-4xl text-6xl font-black leading-[1.05] tracking-tight text-white lg:text-8xl"
        >
          Sync your team <br />
          <span className="bg-gradient-to-r from-violet-400 via-white to-indigo-400 bg-clip-text text-transparent">
            at the speed of light.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-zinc-500"
        >
          A unified workspace for modern teams. Real-time messaging, 
          intelligent organization, and seamless collaboration built 
          to move as fast as you do.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/register">
            <Button size="lg" className="h-16 rounded-2xl bg-white px-10 text-base font-bold text-black hover:bg-zinc-200 shadow-2xl shadow-white/10 active:scale-95 transition-all group">
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="h-16 rounded-2xl border-white/10 bg-white/5 px-10 text-base font-bold text-white hover:bg-white/10 backdrop-blur-sm transition-all group"
          >
            <Play className="mr-2 h-4 w-4 fill-white transition-transform group-hover:scale-110" />
            Watch Product Demo
          </Button>
        </motion.div>

        {/* Floating Product Elements - High Impact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative mt-20"
        >
          {/* Main Mockup Container */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-0.5 rounded-[3rem] bg-gradient-to-tr from-violet-500/20 via-white/5 to-indigo-500/20 blur-3xl opacity-50" />
            <div className="relative">
                <WorkspacePreview />
            </div>

            {/* Live Activity Floating Cards */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 top-1/4 hidden lg:flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl shadow-2xl"
            >
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">128 Online</div>
                        <div className="text-[10px] text-zinc-500">Live now</div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 bottom-1/4 hidden lg:flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl shadow-2xl"
            >
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <MessageSquareMore className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">#engineering</div>
                        <div className="text-[10px] text-zinc-500">3 new messages</div>
                    </div>
                </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
