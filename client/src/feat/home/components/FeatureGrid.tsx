import { 
  Zap, 
  ShieldCheck, 
  Layout, 
  Users, 
  MessageSquare, 
  Lock,
  Search,
  Hash,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Instant Delivery",
    description: "Experience lightning-fast communication with sub-50ms message delivery across all devices.",
    icon: Zap,
    className: "lg:col-span-2",
    accent: "from-amber-500/20"
  },
  {
    title: "Intelligent Search",
    description: "Find any message, file, or member instantly with our vector-based global search.",
    icon: Search,
    className: "lg:col-span-1",
    accent: "from-blue-500/20"
  },
  {
    title: "Granular Controls",
    description: "Role-based permissions and robust encryption ensure your sensitive data remains protected.",
    icon: ShieldCheck,
    className: "lg:col-span-1",
    accent: "from-emerald-500/20"
  },
  {
    title: "Bento Hierarchy",
    description: "Organize conversations into a beautiful hierarchy of workspaces, rooms, and threaded replies.",
    icon: Layout,
    className: "lg:col-span-2",
    accent: "from-violet-500/20"
  },
  {
    title: "Live Presence",
    description: "See who's online and typing in real-time. Stay connected with your team without the guesswork.",
    icon: Users,
    className: "lg:col-span-1",
    accent: "from-indigo-500/20"
  },
  {
    title: "Private Channels",
    description: "Secure, encrypted channels for sensitive discussions and executive decision making.",
    icon: Lock,
    className: "lg:col-span-1",
    accent: "from-cyan-500/20"
  },
  {
    title: "Rich Formatting",
    description: "Full markdown support, code highlighting, and file previews for comprehensive discussions.",
    icon: Hash,
    className: "lg:col-span-1",
    accent: "from-pink-500/20"
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-black tracking-tight text-white lg:text-6xl">
                Engineered for <span className="text-violet-500">performance.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-zinc-500">
                SyncSpace is built with a technical-first approach. Every interaction is optimized 
                for speed and reliability, so your team never has to wait.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#09090b] p-8 transition-all hover:border-violet-500/20 hover:bg-zinc-900/50 ${feature.className}`}
              >
                {/* Glow Effect */}
                <div className={`absolute -right-12 -top-12 h-40 w-40 bg-gradient-to-br ${feature.accent} to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white tracking-tight">
                        {feature.title}
                    </h3>
                    <p className="text-base font-medium leading-relaxed text-zinc-500">
                        {feature.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Activity className="h-3 w-3" />
                    Active Pipeline
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
