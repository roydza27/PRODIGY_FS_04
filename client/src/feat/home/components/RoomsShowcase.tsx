import { Lock, Mic, Hash } from "lucide-react";
import RoomsPreview from "./RoomsPreview";

export default function RoomsShowcase() {
  return (
    <section className="py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">
        <RoomsPreview />

        <div>
          <div className="mb-4 inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            Rooms & Channels
          </div>

          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white">
            Keep conversations organized.
          </h2>

          <p className="mb-10 max-w-lg text-lg text-zinc-400">
            Separate discussions into dedicated
            rooms so projects remain focused,
            searchable, and easy to navigate.
          </p>

          <div className="space-y-4">
            <Feature icon={<Hash className="h-5 w-5" />}>
              Text channels
            </Feature>

            <Feature icon={<Mic className="h-5 w-5" />}>
              Voice channels
            </Feature>

            <Feature icon={<Lock className="h-5 w-5" />}>
              Private rooms
            </Feature>

            <Feature icon={<Hash className="h-5 w-5" />}>
              Role-based permissions
            </Feature>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-indigo-400">
        {icon}
      </div>

      <span className="text-zinc-300">
        {children}
      </span>
    </div>
  );
}