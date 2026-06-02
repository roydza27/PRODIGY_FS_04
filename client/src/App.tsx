import AppRouter from "@/app/routes";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "@/app/stores/auth.store";

function App() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-[#111113] text-white">Loading session...</div>;
  }

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;