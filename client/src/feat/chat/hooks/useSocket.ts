import { createContext, useContext } from "react";

interface SocketContextType {
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used within a SocketProvider"
    );
  }

  return context;
}
