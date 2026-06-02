import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/stores/auth.store";

export default function GuestGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If they are logged in, send them to the main app (e.g., /dashboard or /workspaces)
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Otherwise, let them see the auth pages
  return <Outlet />;
}