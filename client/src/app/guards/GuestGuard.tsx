import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/stores/auth.store";

export default function GuestGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-400">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-lg">
          Loading session...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}