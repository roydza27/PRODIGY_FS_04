import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/app/stores/auth.store";
import { socketService } from "@/services/socket/socket.service";

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used within a SocketProvider"
    );
  }

  return context;
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({
  children,
}: SocketProviderProps) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [isConnected, setIsConnected] =
    useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);

    if (isAuthenticated && token) {
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off(
        "disconnect",
        handleDisconnect
      );
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}