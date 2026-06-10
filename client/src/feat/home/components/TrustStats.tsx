import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "Messages Delivered", value: 15420, suffix: "M+" },
  { label: "Active Teams", value: 12500, suffix: "+" },
  { label: "Projects Synced", value: 450, suffix: "K+" },
  { label: "System Uptime", value: 99.99, suffix: "%", isFloat: true },
];

export default function TrustStats() {
  return (
    <section className="bg-zinc-950 py-20 md:py-32 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col items-center justify-center transition-colors"
            >
              {/* FIX 1: Added `tabular-nums` to stop the numbers from wiggling while animating.
                FIX 2: Tightened the bottom margin to `mb-1` to match the design.
              */}
              <div className="mb-1 text-5xl font-black tracking-tighter text-white tabular-nums lg:text-6xl xl:text-[4rem]">
                {/* FIX 3: Put the Counter and span on the EXACT SAME LINE. 
                  This removes the annoying space React injects between JSX elements.
                */}
                <Counter from={0} to={stat.value} duration={2} isFloat={stat.isFloat} /><span className="text-violet-500">{stat.suffix}</span>
              </div>
              
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-zinc-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ 
  from, 
  to, 
  duration, 
  isFloat = false 
}: { 
  from: number; 
  to: number; 
  duration: number;
  isFloat?: boolean;
}) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = from + (to - from) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(to); 
      }
    };
    
    window.requestAnimationFrame(step);
  }, [from, to, duration]);

  const displayValue = isFloat ? count.toFixed(2) : Math.floor(count);

  return <span>{displayValue}</span>;
}