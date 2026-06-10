import ChatPreview from "./ChatPreview";
import { motion } from "framer-motion";

export default function RealtimeSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background Gradient Accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-3xl text-center md:mb-24"
        >
          <div className="mb-6 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-bold text-violet-300">
            Real-Time Messaging
          </div>

          <h2 className="mb-6 text-5xl font-extrabold tracking-tight text-white leading-[1.1] lg:text-6xl">
            Communication that feels <span className="text-violet-500">instant.</span>
          </h2>

          <p className="text-xl leading-relaxed text-zinc-400 font-medium">
            Built on a modern real-time architecture
            so messages appear instantly across
            your workspace, keeping your team in sync.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
        >
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-violet-500/20 via-indigo-500/20 to-violet-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative rounded-[2.5rem] border border-white/10 bg-[#111113] p-4 shadow-2xl overflow-hidden">
            <ChatPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}