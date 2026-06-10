import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-violet-700 via-indigo-800 to-[#090909] px-10 py-20 text-left lg:px-24 lg:py-32 ring-1 ring-white/10 shadow-2xl shadow-violet-500/10">
          {/* Animated Background Glow */}
          <div className="absolute -inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          
          <div className="relative z-10 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <Sparkles className="h-4 w-4" />
                    Ready to collaborate better?
                </div>

                <h2 className="mb-8 text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1]">
                    Build your team's <br className="hidden sm:block" />
                    <span className="text-black/30">home today.</span>
                </h2>

                <p className="mb-12 max-w-2xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl">
                    Join over 2,000+ modern engineering teams and start syncing 
                    at the speed of light. No credit card required.
                </p>

                <div className="flex flex-col sm:flex-row justify-start gap-4">
                    <Link to="/register" className="w-full sm:w-auto">
                        <Button size="lg" className="h-16 w-full rounded-2xl bg-white px-10 text-sm font-bold text-black hover:bg-zinc-200 shadow-2xl active:scale-95 transition-all group">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto">
                        <Button size="lg" variant="ghost" className="h-16 w-full rounded-2xl bg-white/10 border border-white/10 px-10 text-sm font-bold text-white hover:bg-white/20 backdrop-blur-md transition-all active:scale-95">
                        Sign In to Workspace
                        </Button>
                    </Link>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


