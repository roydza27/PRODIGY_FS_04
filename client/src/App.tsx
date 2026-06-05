import AppRouter from "@/app/routes";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "@/app/stores/auth.store";
import { SocketProvider } from "@/feat/chat/components/SocketProvider";

function App() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#111113] text-white">
        Loading session...
      </div>
    );
  }

  return (
    <SocketProvider>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </SocketProvider>
  );
}

export default App;