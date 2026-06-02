import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/stores/auth.store";

export default function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If they are NOT logged in, kick them back to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Assuming "/" is your login page right now
  }

  // Otherwise, let them into the app
  return <Outlet />;
}