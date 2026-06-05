import { ArrowRight, Headphones, ShoppingCart, Store, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-left">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#DB4444]/15 via-[#141416] to-[#0a0a0c] px-6 py-10 shadow-2xl shadow-black/60 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* Radial Mesh Accent Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(219,68,68,0.12),transparent_35%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            
            {/* Left Narrative Frame */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DB4444]/20 bg-[#DB4444]/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#ff8d8d] backdrop-blur-md">
                <Store className="h-3.5 w-3.5 text-[#DB4444]" />
                Ready to shop
              </div>

              <div className="space-y-3">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                  Experience a premium, local store catalog today.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                  Explore full checkout integrations, dynamic shopping carts, live stock monitoring, and secure payment layers optimized for your regional workflow.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Link to="/products">
                  <Button className="h-14 w-full sm:w-fit rounded-2xl bg-white px-7 text-black hover:bg-zinc-100 transition-all duration-300 shadow-xl active:scale-98 font-medium group">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button
                    variant="secondary"
                    className="h-14 w-full sm:w-fit rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group"
                  >
                    Contact Support
                    <Headphones className="ml-2 h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Structural Showcase Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              
              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[24px] border border-white/5 bg-black/30 p-5 backdrop-blur-xl shadow-inner group/card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors group-hover/card:border-[#DB4444]/30 group-hover/card:bg-[#DB4444]/10 group-hover/card:text-[#DB4444]">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-zinc-500">
                      Smart Cart Processing
                    </p>
                    <p className="text-sm font-medium text-zinc-200 leading-relaxed">
                      Add, modify, and review local items instantly through secure unified state caches.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[24px] border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.04] hover:border-white/10 group/card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors group-hover/card:border-emerald-500/30 group-hover/card:bg-emerald-500/10 group-hover/card:text-emerald-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-zinc-500">
                      Real-time Despatch
                    </p>
                    <p className="text-sm font-medium text-zinc-200 leading-relaxed">
                      Track fulfillment parameters and order dispatch metrics the second verification lands.
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