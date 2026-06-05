import { ArrowRight, BadgePercent, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PromoBannerSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-left">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#161619] via-[#111113] to-[#0b0b0d] px-6 py-10 shadow-2xl shadow-black/50 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          
          {/* Hardware Accelerated Background Radial Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,68,68,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_40%)]" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#DB4444]/10 blur-3xl" />
          
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            
            {/* Left Column Content Matrix */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DB4444]/30 bg-[#DB4444]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#ff8d8d] backdrop-blur-sm">
                <BadgePercent className="h-3.5 w-3.5 text-[#DB4444] animate-pulse" />
                Limited time offer
              </div>

              <div className="space-y-4">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                  Build a storefront that feels polished and conversion-ready.
                </h2>
                <p className="max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                  Use this banner to highlight seasonal discounts, bundle offers, or featured local products with a premium dark theme.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Link to="/products">
                  <Button className="h-14 w-full sm:w-fit rounded-2xl bg-[#DB4444] px-7 text-white hover:bg-[#c53a3a] shadow-lg shadow-[#DB4444]/20 transition-all duration-300 active:scale-98 group">
                    Shop the offer
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button
                    variant="secondary"
                    className="h-14 w-full sm:w-fit rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column Fluid Spot Card Display */}
            <div className="relative w-full">
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mx-auto w-full h-auto max-w-md sm:aspect-[4/3] md:max-w-2xl rounded-[28px] border border-white/10 bg-black/40 p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-black/40"
              >
                <div className="flex h-full flex-col justify-between gap-6 rounded-[24px] border border-dashed border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5">
                  
                  {/* Card Header Panel */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-left">
                      <p className="text-xs uppercase font-medium tracking-[0.24em] text-zinc-500">
                        Deal spotlight
                      </p>
                      <h3 className="mt-1.5 text-2xl font-semibold text-white tracking-tight sm:text-3xl">
                        Up to 40% Off
                      </h3>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DB4444]/20 bg-[#DB4444]/15 px-3 py-1 text-xs font-semibold text-[#ff9a9a] uppercase tracking-wider shadow-sm">
                      <Sparkles className="h-3 w-3 text-[#DB4444]" />
                      Today only
                    </div>
                  </div>

                  {/* Features Mini Row Grids */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-left">
                    <div className="group/item rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] hover:border-white/10">
                      <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400 w-fit">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                        Fast delivery
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-zinc-200 group-hover/item:text-white transition-colors">
                        Local shipping support
                      </p>
                    </div>
                    
                    <div className="group/item rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] hover:border-white/10">
                      <div className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400 w-fit">
                        <Zap className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                        Secure checkout
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-zinc-200 group-hover/item:text-white transition-colors">
                        Smooth payment flow
                      </p>
                    </div>
                  </div>

                  {/* Footer Dynamic Layout Offer */}
                  <div className="rounded-2xl border border-white/10 bg-[#0c0c0e]/90 p-4 shadow-inner">
                    <div className="flex items-center justify-between gap-4 text-left">
                      <div className="space-y-0.5">
                        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500">
                          Bundle offer
                        </p>
                        <p className="text-base font-semibold text-white tracking-tight">
                          Buy 2, save more
                        </p>
                      </div>
                      
                      <div className="rounded-xl bg-[#DB4444]/10 px-3 py-1.5 border border-[#DB4444]/20">
                        <p className="text-2xl font-bold text-[#DB4444] tracking-tight leading-none">-20%</p>
                      </div>
                    </div>
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

export default PromoBannerSection;