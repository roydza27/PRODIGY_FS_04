import { Check } from "lucide-react";
import WorkspaceCards from "./WorkspaceCards";
import { motion } from "framer-motion";

const features = [
  "Create multiple isolated workspaces",
  "Invite team members with role-based access",
  "Manage workspace settings and branding",
  "Organize rooms and channels efficiently",
];

export default function WorkspaceShowcase() {
  return (
    <section
      id="workspaces"
      className="py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-bold text-violet-300">
            Workspaces
          </div>

          <h2 className="mb-6 text-5xl font-extrabold tracking-tight text-white leading-[1.1] lg:text-6xl">
            Everything starts with a <span className="text-violet-500">workspace.</span>
          </h2>

          <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-400 font-medium">
            Create dedicated spaces for teams,
            projects, communities, and clients.
            Keep everything organized from day one.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 transition-colors group-hover:bg-violet-500/20">
                  <Check className="h-5 w-5 text-violet-400" />
                </div>

                <span className="text-lg font-medium text-zinc-300 transition-colors group-hover:text-white">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-violet-500/5 blur-3xl rounded-full" />
          <WorkspaceCards />
        </motion.div>
      </div>
    </section>
  );
}