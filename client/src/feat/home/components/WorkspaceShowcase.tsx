import { Check } from "lucide-react";
import WorkspaceCards from "./WorkspaceCards";

const features = [
  "Create multiple workspaces",
  "Invite team members",
  "Manage workspace settings",
  "Organize rooms efficiently",
];

export default function WorkspaceShowcase() {
  return (
    <section
      id="workspaces"
      className="py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Workspaces
          </div>

          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white">
            Everything starts with a workspace.
          </h2>

          <p className="mb-10 max-w-lg text-lg text-zinc-400">
            Create dedicated spaces for teams,
            projects, communities, and clients.
            Keep everything organized from day one.
          </p>

          <div className="space-y-5">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15">
                  <Check className="h-4 w-4 text-violet-400" />
                </div>

                <span className="text-zinc-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <WorkspaceCards />
      </div>
    </section>
  );
}