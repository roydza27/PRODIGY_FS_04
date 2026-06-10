import { ArrowRight, Headphones, MessageSquare, Building2, Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-left">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-violet-600/20 via-[#111113] to-[#09090b] px-8 py-12 shadow-2xl shadow-black/60 sm:px-12 sm:py-16 lg:px-20 lg:py-24">
          {/* Radial Mesh Accent Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.1),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.15),transparent_45%)]" />

          <div className="relative z-10 grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            
            {/* Left Narrative Frame */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-300 backdrop-blur-md">
                <Building2 className="h-4 w-4" />
                Ready to sync up?
              </div>

              <div className="space-y-6">
                <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Experience a premium team collaboration platform.
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-zinc-400 font-medium">
                  Join thousands of teams that use SyncSpace to organize their work, streamline communication, and build better products together.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row pt-4">
                <Link to="/register">
                  <Button size="lg" className="h-16 w-full sm:w-fit rounded-2xl bg-violet-600 px-10 text-white hover:bg-violet-700 transition-all duration-300 shadow-xl shadow-violet-600/20 active:scale-95 font-bold group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="h-16 w-full sm:w-fit rounded-2xl border-white/10 bg-white/5 px-10 text-white hover:bg-white/10 transition-all duration-300 group font-bold"
                  >
                    Contact Support
                    <Headphones className="ml-2 h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Structural Showcase Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              
              <motion.div 
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl shadow-inner group/card hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-zinc-400 transition-all group-hover/card:border-violet-500/30 group-hover/card:bg-violet-500/10 group-hover/card:text-violet-400">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
                      Smart Messaging
                    </p>
                    <p className="text-base font-semibold text-zinc-200 leading-relaxed">
                      Instant message delivery with rich formatting and threaded replies for clear communication.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition-colors hover:bg-white/[0.04] hover:border-white/10 group/card"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-zinc-400 transition-all group-hover/card:border-emerald-500/30 group-hover/card:bg-emerald-500/10 group-hover/card:text-emerald-400">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
                      Real-time Presence
                    </p>
                    <p className="text-base font-semibold text-zinc-200 leading-relaxed">
                      Always know who's available and connected across your team with live presence indicators.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CTASection;