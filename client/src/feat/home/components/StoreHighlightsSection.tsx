import {
  ShieldCheck,
  Truck,
  Headphones,
  RefreshCcw,
} from "lucide-react";

const highlights = [
  {
    title: "Secure Payments",
    description:
      "Protected checkout experience with reliable payment handling.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Delivery",
    description:
      "Quick local delivery support with smooth order processing.",
    icon: Truck,
  },
  {
    title: "Customer Support",
    description:
      "Responsive support system for orders, tracking, and assistance.",
    icon: Headphones,
  },
  {
    title: "Easy Returns",
    description:
      "Simple return workflow designed for a better shopping experience.",
    icon: RefreshCcw,
  },
];

const StoreHighlightsSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col text-left gap-10">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Store Highlights
          </div>

          <div className="space-y-2">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Designed for a smoother shopping experience.
            </h2>

            <p className="max-w-2xl text-base leading-7 text-zinc-400">
              Build trust with customers through strong delivery systems,
              support, secure checkout, and a polished user experience.
            </p>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,68,68,0.12),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                    <Icon className="h-6 w-6 text-zinc-100" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-7 text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Metrics */}
        <div className="grid gap-4 rounded-[32px] border border-white/10 bg-[#151518] p-6 sm:grid-cols-2 xl:grid-cols-4 xl:p-8">
          {[
            { label: "Products", value: "1,200+" },
            { label: "Orders Delivered", value: "8,500+" },
            { label: "Customer Rating", value: "4.9/5" },
            { label: "Support Availability", value: "24/7" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                {metric.label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreHighlightsSection;