import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is SyncSpace really free for small teams?",
    a: "Yes! Our Free plan includes unlimited messages, up to 3 workspaces, and 1GB of storage. No credit card required."
  },
  {
    q: "How secure is my team's data?",
    a: "We use AES-256 encryption at rest and TLS 1.3 for data in transit. Your messages are never sold or used for AI training."
  },
  {
    q: "Can I migrate from Slack or Discord?",
    a: "We offer one-click migration tools for both platforms, preserving your message history, files, and member profiles."
  },
  {
    q: "What makes SyncSpace faster than competitors?",
    a: "Our core is built on a custom Rust-based messaging engine and optimized WebSocket protocol for sub-50ms latency."
  }
];

export default function FAQ() {
  return (
    <section className="bg-[#090909] py-20 md:py-32 lg:py-48">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-24 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
                Help Center
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                Frequently Asked <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Questions.</span>
            </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-[2rem] border transition-all duration-500 ring-1 ring-white/5 ${isOpen ? 'border-violet-500/30 bg-white/[0.04] shadow-2xl shadow-violet-500/5' : 'border-white/[0.05] bg-[#111111] hover:border-white/[0.1] hover:bg-[#141414]'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-8 text-left transition-colors group"
      >
        <span className={`text-lg font-bold tracking-tight transition-colors ${isOpen ? 'text-violet-400' : 'text-white'}`}>{q}</span>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${isOpen ? 'bg-violet-600 rotate-180' : 'bg-white/[0.05] group-hover:bg-white/[0.1]'}`}>
            {isOpen ? <Minus className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-8 pb-8 text-base font-medium leading-relaxed text-zinc-400 text-left">
              <div className="pt-2 border-t border-white/[0.05]">
                {a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


