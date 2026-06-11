import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";
import { socketService } from "@/services/socket/socket.service";
import { getPresence } from "@/feat/users/api/user.api";
import { workspaceKeys } from "@/feat/workspaces/api/workspace.queries";
import { SocketContext } from "../hooks/useSocket";

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({
  children,
}: SocketProviderProps) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const setOnlineUsers = usePresenceStore(
    (state) => state.setOnlineUsers
  );
  const setUserOnline = usePresenceStore(
    (state) => state.setUserOnline
  );
  const setUserOffline = usePresenceStore(
    (state) => state.setUserOffline
  );

  const clearPresence = usePresenceStore(
    (state) => state.clearPresence
  );

  const setTyping = usePresenceStore(
    (state) => state.setTyping
  );

  const [isConnected, setIsConnected] =
    useState(false);

  useEffect(() => {
    const handleConnect = () => {
      console.info("[Socket] Connected - fetching presence");
      setIsConnected(true);
      
      // Fetch initial presence list as a fallback/additional sync
      getPresence()
        .then(setOnlineUsers)
        .catch(console.error);
    };

    const handleDisconnect = () => {
      console.info("[Socket] Disconnected");
      setIsConnected(false);
    };

    const handlePresenceSync = ({
      userIds,
    }: {
      userIds: string[];
    }) => {
      console.info("[Presence] sync", userIds.length, "users online");
      setOnlineUsers(userIds);
    };

    const handlePresenceOnline = ({
      userId,
    }: {
      userId: string;
    }) => {
      console.info("[Presence] online", userId);
      setUserOnline(userId);
    };

    const handlePresenceOffline = ({
      userId,
      lastSeenAt,
    }: {
      userId: string;
      lastSeenAt?: string;
    }) => {
      console.info("[Presence] offline", userId, lastSeenAt);
      setUserOffline(userId, lastSeenAt);
    };

    const handleTypingStart = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      setTyping(conversationId, userId, true);
    };

    const handleTypingStop = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      setTyping(conversationId, userId, false);
    };

    const handleRoomTypingStart = ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      setTyping(roomId, userId, true);
    };

    const handleRoomTypingStop = ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      setTyping(roomId, userId, false);
    };

    const handleWorkspaceMembersUpdated = () => {
      console.info("[Socket] Workspace members updated - invalidating queries");
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    };

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on(
      "presence:sync",
      handlePresenceSync
    );
    socketService.on(
      "presence:online",
      handlePresenceOnline
    );
    socketService.on(
      "presence:offline",
      handlePresenceOffline
    );
    socketService.on(
      "dm:typing:start",
      handleTypingStart
    );
    socketService.on(
      "dm:typing:stop",
      handleTypingStop
    );
    socketService.on(
      "room:typing:start",
      handleRoomTypingStart
    );
    socketService.on(
      "room:typing:stop",
      handleRoomTypingStop
    );

    // Membership Events
    socketService.on("workspace:member-joined", handleWorkspaceMembersUpdated);
    socketService.on("workspace:member-removed", handleWorkspaceMembersUpdated);
    socketService.on("workspace:member-updated", handleWorkspaceMembersUpdated);
    socketService.on("workspace:invited", handleWorkspaceMembersUpdated);
    socketService.on("workspace:removed", handleWorkspaceMembersUpdated);

    if (isAuthenticated && token) {
      console.info("[Socket] Connecting with token");
      socketService.connect(token);
      
      // If already connected, manual sync is needed because the 'connect' event won't fire again
      if (socketService.isConnected()) {
        console.info("[Socket] Already connected - manual sync");
        setTimeout(() => {
          setIsConnected(true);
        }, 0);
        getPresence().then(setOnlineUsers).catch(console.error);
      }
    } else {
      console.info("[Socket] Not authenticated, disconnecting");
      socketService.disconnect();
      clearPresence(); // Clear presence on logout
    }

    return () => {
      console.info("[Socket] Cleaning up listeners and disconnecting");
      socketService.off(
        "connect",
        handleConnect
      );
      socketService.off(
        "disconnect",
        handleDisconnect
      );
      socketService.off(
        "presence:sync",
        handlePresenceSync
      );
      socketService.off(
        "presence:online",
        handlePresenceOnline
      );
      socketService.off(
        "presence:offline",
        handlePresenceOffline
      );
      socketService.off(
        "dm:typing:start",
        handleTypingStart
      );
      socketService.off(
        "dm:typing:stop",
        handleTypingStop
      );
      socketService.off(
        "room:typing:start",
        handleRoomTypingStart
      );
      socketService.off(
        "room:typing:stop",
        handleRoomTypingStop
      );

      socketService.off("workspace:member-joined", handleWorkspaceMembersUpdated);
      socketService.off("workspace:member-removed", handleWorkspaceMembersUpdated);
      socketService.off("workspace:member-updated", handleWorkspaceMembersUpdated);
      socketService.off("workspace:invited", handleWorkspaceMembersUpdated);
      socketService.off("workspace:removed", handleWorkspaceMembersUpdated);

      // Explicitly disconnect when unmounting or dependencies change
      // This is crucial for logout scenarios where the provider might unmount
      socketService.disconnect();
    };
  }, [
    isAuthenticated,
    token,
    setOnlineUsers,
    setUserOnline,
    setUserOffline,
    clearPresence,
    setTyping,
    queryClient,
  ]);

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
