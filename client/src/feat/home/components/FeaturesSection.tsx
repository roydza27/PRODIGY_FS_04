import { Laptop, ShieldCheck, Headset, Zap, Globe, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Intent Search",
    description: "Navigate products smoothly with an integrated local search processing pipeline designed for instant query matching.",
    icon: Laptop,
    accent: "from-blue-500/10 to-transparent",
    iconColor: "text-blue-400"
  },
  {
    title: "Granular Security",
    description: "Keep personal profiles and purchase catalogs isolated safely behind professional data-firewall architecture configurations.",
    icon: ShieldCheck,
    accent: "from-emerald-500/10 to-transparent",
    iconColor: "text-emerald-400"
  },
  {
    title: "1-Click Checkout",
    description: "Enjoy a friction-free shopping flow using optimized memory cache systems built for lightning-fast cart dispatch actions.",
    icon: Zap,
    accent: "from-amber-500/10 to-transparent",
    iconColor: "text-amber-400"
  },
  {
    title: "24/7 Order Help",
    description: "Get real-time workspace updates and empathetic operational assistance directly through automated live messaging tracks.",
    icon: Headset,
    accent: "from-purple-500/10 to-transparent",
    iconColor: "text-purple-400"
  },
  {
    title: "Open API Ingestion",
    description: "Index custom UI components and manage repository packages using a scalable, unified asset registry pipeline layer.",
    icon: Globe,
    accent: "from-cyan-500/10 to-transparent",
    iconColor: "text-cyan-400"
  },
  {
    title: "Live Notifications",
    description: "Stay perfectly synchronized on dispatch stages with automatic environment variable broadcast systems across webhooks.",
    icon: MessageSquare,
    accent: "from-pink-500/10 to-transparent",
    iconColor: "text-pink-400"
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28 text-left relative overflow-hidden bg-[#111113]">
      {/* Background Ambient Blur Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#DB4444]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header Block */}
        <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center md:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400 mb-4">
            Platform Capabilities
          </div>
          
          <h2 className="mb-5 font-heading text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.05] text-white">
            Engineered for Performance.
          </h2>

          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-400 font-light">
            Discover the foundational tools running behind Zynta's infrastructure—optimized for blazing fast browsing, clean data handling, and elite client delivery interfaces.
          </p>
        </div>

        {/* Dynamic Grid Layout Matrix */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#17171b]/60 p-6 shadow-xl backdrop-blur-md transition-colors hover:border-white/10 hover:bg-[#17171b]/90"
              >
                {/* Custom Micro-Glow Underlay Track */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,68,68,0.04),transparent_45%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-5">
                  {/* Enhanced Frame Box Icon */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40 ${feature.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-white group-hover:text-[#DB4444] transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400 font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Styled Text-Action Button */}
                <div className="relative z-10 mt-6 pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:text-white group/link"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1 text-zinc-500 group-hover/link:text-[#DB4444]" />
                  </Link>
                </div>
                
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}