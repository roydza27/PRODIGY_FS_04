import { 
  Zap, 
  ShieldCheck, 
  Layout, 
  Users, 
  MessageSquare, 
  Lock,
  ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Real-time Messaging",
    description: "Experience lightning-fast communication with instant message delivery across all your workspaces and rooms.",
    icon: Zap,
    accent: "from-amber-500/10 to-transparent",
    iconColor: "text-amber-400"
  },
  {
    title: "Workspace Isolation",
    description: "Keep different projects and teams organized with dedicated workspaces that maintain complete data separation.",
    icon: ShieldCheck,
    accent: "from-emerald-500/10 to-transparent",
    iconColor: "text-emerald-400"
  },
  {
    title: "Room Hierarchy",
    description: "Organize conversations into public and private rooms, making it easy to find and follow relevant discussions.",
    icon: Layout,
    accent: "from-blue-500/10 to-transparent",
    iconColor: "text-blue-400"
  },
  {
    title: "Presence Tracking",
    description: "See who's online and available in real-time. Stay connected with your team without the guesswork.",
    icon: Users,
    accent: "from-purple-500/10 to-transparent",
    iconColor: "text-purple-400"
  },
  {
    title: "Rich Conversations",
    description: "Support for direct messages, mentions, and threaded conversations to keep communication flowing naturally.",
    icon: MessageSquare,
    accent: "from-pink-500/10 to-transparent",
    iconColor: "text-pink-400"
  },
  {
    title: "Enterprise Security",
    description: "Role-based permissions and robust encryption ensure your sensitive team data remains secure and private.",
    icon: Lock,
    accent: "from-cyan-500/10 to-transparent",
    iconColor: "text-cyan-400"
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24 md:px-8 md:py-32 text-left relative overflow-hidden bg-[#111113]">
      {/* Background Ambient Blur Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header Block */}
        <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center md:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] font-bold text-violet-300 mb-6">
            Platform Capabilities
          </div>
          
          <h2 className="mb-6 font-heading text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Everything your team needs to <span className="text-violet-500">sync up.</span>
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400 font-medium">
            Discover the powerful tools built into SyncSpace's infrastructure—optimized for blazing fast messaging, secure data handling, and elite team collaboration.
          </p>
        </div>

        {/* Dynamic Grid Layout Matrix */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/5 bg-[#17171b]/40 p-8 shadow-2xl backdrop-blur-md transition-all hover:border-violet-500/30 hover:bg-[#17171b]/80"
              >
                {/* Custom Micro-Glow Underlay Track */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 space-y-6">
                  {/* Enhanced Frame Box Icon */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 ${feature.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-base leading-relaxed text-zinc-400 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Styled Text-Action Button */}
                <div className="relative z-10 mt-8">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400 transition-all hover:text-white group/link"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1 text-zinc-600 group-hover/link:text-violet-500" />
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