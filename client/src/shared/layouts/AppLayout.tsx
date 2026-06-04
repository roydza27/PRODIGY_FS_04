import { Outlet } from "react-router-dom";

import { useAuthStore } from "@/app/stores/auth.store";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#111113]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">
              RepoSense
            </h1>
          </div>

          <div className="text-sm text-muted-foreground">
            {user?.displayName || user?.name}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}