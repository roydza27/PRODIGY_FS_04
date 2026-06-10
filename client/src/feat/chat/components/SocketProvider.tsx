import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";
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

  const { setOnlineUsers, setUserOnline, setUserOffline } = usePresenceStore();

  const [isConnected, setIsConnected] =
    useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handlePresenceSync = ({ userIds }: { userIds: string[] }) => {
      setOnlineUsers(userIds);
    };

    const handlePresenceOnline = ({ userId }: { userId: string }) => {
      setUserOnline(userId);
    };

    const handlePresenceOffline = ({ userId }: { userId: string }) => {
      setUserOffline(userId);
    };

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on("presence:sync", handlePresenceSync);
    socketService.on("presence:online", handlePresenceOnline);
    socketService.on("presence:offline", handlePresenceOffline);

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
      socketService.off("presence:sync", handlePresenceSync);
      socketService.off("presence:online", handlePresenceOnline);
      socketService.off("presence:offline", handlePresenceOffline);
    };
  }, [isAuthenticated, token, setOnlineUsers, setUserOnline, setUserOffline]);

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