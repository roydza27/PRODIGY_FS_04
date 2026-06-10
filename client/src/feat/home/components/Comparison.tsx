import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Real-time message delivery",
  "Unlimited message history",
  "Isolated workspaces",
  "Advanced role permissions",
  "Global vector search",
  "Dedicated mobile app",
  "Enterprise SLA",
  "Custom branding"
];

export default function Comparison() {
  return (
    <section className="bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-black tracking-tight text-white lg:text-6xl">
                Why <span className="text-violet-500">SyncSpace?</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-zinc-500">
                We've built a platform that scales with your ambition, without the 
                bloat of legacy enterprise tools.
            </p>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#09090b] shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-8 text-sm font-black uppercase tracking-widest text-zinc-500">Feature</th>
                <th className="p-8 text-center text-sm font-black uppercase tracking-widest text-violet-400 bg-violet-500/5">SyncSpace</th>
                <th className="p-8 text-center text-sm font-black uppercase tracking-widest text-zinc-500">Traditional Tools</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature} className={index !== features.length - 1 ? "border-b border-white/5" : ""}>
                  <td className="p-8 text-base font-bold text-white tracking-tight">{feature}</td>
                  <td className="p-8 text-center bg-violet-500/5">
                    <div className="flex justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                            <Check className="h-4 w-4" />
                        </div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <div className="flex justify-center">
                        {index < 4 ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                                <Check className="h-4 w-4" />
                            </div>
                        ) : (
                            <X className="h-4 w-4 text-zinc-800" />
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
