const stats = [
  {
    value: "15K+",
    label: "Messages Sent",
  },
  {
    value: "120+",
    label: "Workspaces",
  },
  {
    value: "350+",
    label: "Rooms Created",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
];

export default function StatsSection() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-4xl font-bold text-white">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm uppercase tracking-wider text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}