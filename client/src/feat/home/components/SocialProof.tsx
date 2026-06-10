import { motion } from "framer-motion";

const logos = [
  "ACME", "STRIPE", "VERCEL", "LINEAR", "DISCORD", "CLERK", "SUPABASE", "NOTION"
];

export default function SocialProof() {
  return (
    <section className="relative overflow-hidden bg-black py-12 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
          Trusted by modern engineering teams
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          {logos.map((logo) => (
            <div key={logo} className="text-2xl font-black tracking-tighter text-white">
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Gradient Fade */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </section>
  );
}
