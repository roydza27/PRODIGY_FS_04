import { Button } from "@/shared/components/ui/button";
import WorkspacePreview from "./WorkspacePreview";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[180px]" />

      <div className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-20 px-6 py-20 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            ✨ Real-time workspace collaboration
          </div>

          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight text-white lg:text-8xl">
            Built for teams that{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              move fast
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-lg text-zinc-400">
            Create workspaces, organize rooms,
            collaborate instantly and keep every
            conversation where it belongs.
          </p>

          <div className="flex gap-4">
            <Button size="lg">
              Get Started
            </Button>

            <Button
              size="lg"
              variant="outline"
            >
              View Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-6">
            <Stat value="15K+" label="Messages" />
            <Stat value="120+" label="Workspaces" />
            <Stat value="350+" label="Rooms" />
            <Stat value="99.9%" label="Uptime" />
          </div>
        </div>

        <WorkspacePreview />
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">
        {value}
      </div>

      <div className="text-sm text-zinc-500">
        {label}
      </div>
    </div>
  );
}