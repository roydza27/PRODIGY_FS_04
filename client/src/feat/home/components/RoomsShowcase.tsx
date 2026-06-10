import { Lock, Mic, Hash, Shield, Users } from "lucide-react";
import RoomsPreview from "./RoomsPreview";
import { motion } from "framer-motion";

export default function RoomsShowcase() {
  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-2 lg:order-1 relative"
        >
          <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full" />
          <RoomsPreview />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <div className="mb-6 inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-bold text-indigo-300">
            Rooms & Channels
          </div>

          <h2 className="mb-6 text-5xl font-extrabold tracking-tight text-white leading-[1.1] lg:text-6xl">
            Keep conversations <span className="text-indigo-500">organized.</span>
          </h2>

          <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-400 font-medium">
            Separate discussions into dedicated
            rooms so projects remain focused,
            searchable, and incredibly easy to navigate.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Feature icon={<Hash className="h-5 w-5" />} delay={0.1}>
              Public text channels
            </Feature>

            <Feature icon={<Mic className="h-5 w-5" />} delay={0.2}>
              Live voice channels
            </Feature>

            <Feature icon={<Lock className="h-5 w-5" />} delay={0.3}>
              Secure private rooms
            </Feature>

            <Feature icon={<Shield className="h-5 w-5" />} delay={0.4}>
              Role-based permissions
            </Feature>

            <Feature icon={<Users className="h-5 w-5" />} delay={0.5}>
              Member management
            </Feature>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-white/10 group"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all group-hover:scale-110 group-hover:bg-indigo-500/20">
        {icon}
      </div>

      <span className="text-lg font-semibold text-zinc-300 transition-colors group-hover:text-white">
        {children}
      </span>
    </motion.div>
  );
}