import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { useAuthStore } from "@/app/stores/auth.store";
import { usePresenceStore } from "@/app/stores/presence.store";
import { useNotificationStore } from "@/app/stores/notification.store";
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
  const location = useLocation();
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

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const typingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

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
      const key = `${conversationId}-${userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
      }

      setTyping(conversationId, userId, true);

      typingTimeoutsRef.current[key] = setTimeout(() => {
        setTyping(conversationId, userId, false);
        delete typingTimeoutsRef.current[key];
      }, 5000);
    };

    const handleTypingStop = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      const key = `${conversationId}-${userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
        delete typingTimeoutsRef.current[key];
      }
      setTyping(conversationId, userId, false);
    };

    const handleRoomTypingStart = ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      const key = `${roomId}-${userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
      }

      setTyping(roomId, userId, true);

      typingTimeoutsRef.current[key] = setTimeout(() => {
        setTyping(roomId, userId, false);
        delete typingTimeoutsRef.current[key];
      }, 5000);
    };

    const handleRoomTypingStop = ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      const key = `${roomId}-${userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
        delete typingTimeoutsRef.current[key];
      }
      setTyping(roomId, userId, false);
    };

    const handleWorkspaceMembersUpdated = () => {
      console.info("[Socket] Workspace members updated - invalidating queries");
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    };

    const handleInvited = ({ workspaceName }: { workspaceName: string }) => {
      addNotification({
        type: "invitation",
        title: "Workspace Invitation",
        description: `You've been invited to join ${workspaceName}`,
      });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    };

    const handleNewMessageNotification = (message: Record<string, unknown> & { _id: string; type: string; text: string; roomId?: string; conversationId?: string; senderId?: { _id: string; name?: string; avatarUrl?: string } | string; createdAt?: string }) => {
      console.info("[Socket] New message received - updating sidebars");
      
      const senderId = typeof message.senderId === "string" ? message.senderId : message.senderId?._id;
      const isMyMessage = senderId === useAuthStore.getState().user?.id;
      const isCurrentPage = (message.type === "dm" && location.pathname.includes(message.conversationId as string)) ||
                          (message.type === "room" && location.pathname.includes(message.roomId as string));
      const isFocused = document.hasFocus();

      // Update conversations cache optimistically
      if (message.type === "dm" && message.conversationId) {
        queryClient.setQueryData(["conversations", "global"], (old: Record<string, unknown>[] | undefined) => {
          if (!old) return old;
          const convIndex = old.findIndex((c: Record<string, unknown>) => c._id === message.conversationId);
          if (convIndex === -1) return old; // If not in list, fallback to invalidation later
          
          const newConversations = [...old];
          const conv = { ...newConversations[convIndex] };
          conv.lastMessage = message;
          conv.lastMessageAt = message.createdAt || new Date().toISOString();
          
          // Only increment unread if it's not my message AND we aren't currently reading it
          if (!isMyMessage && !(isCurrentPage && isFocused)) {
            conv.unreadCount = ((conv.unreadCount as number) || 0) + 1;
          }
          
          newConversations[convIndex] = conv;
          // Sort so newest is at the top
          return newConversations.sort((a, b) => new Date(b.lastMessageAt as string).getTime() - new Date(a.lastMessageAt as string).getTime());
        });
      }

      // Update rooms cache optimistically
      if (message.type === "room" && message.roomId) {
        const workspaceId = location.pathname.split("/w/")[1]?.split("/")[0]; // Rough extraction, fallback below
        if (workspaceId) {
          queryClient.setQueryData(["rooms", workspaceId], (old: Record<string, unknown>[] | undefined) => {
            if (!old) return old;
            const roomIndex = old.findIndex((r: Record<string, unknown>) => r._id === message.roomId);
            if (roomIndex === -1) return old;
            
            const newRooms = [...old];
            const room = { ...newRooms[roomIndex] };
            room.lastMessage = message;
            room.lastMessageAt = message.createdAt || new Date().toISOString();
            
            if (!isMyMessage && !(isCurrentPage && isFocused)) {
              room.unreadCount = ((room.unreadCount as number) || 0) + 1;
              // Simple check for mentions
              const myNickname = useAuthStore.getState().user?.name;
              if (myNickname && typeof message.text === "string" && message.text.includes(`@${myNickname}`)) {
                room.mentionCount = ((room.mentionCount as number) || 0) + 1;
              }
            }
            
            newRooms[roomIndex] = room;
            return newRooms.sort((a, b) => new Date(b.lastMessageAt as string).getTime() - new Date(a.lastMessageAt as string).getTime());
          });
        }
      }

      // Still invalidate to ensure absolute sync, but delay it heavily to avoid race condition with mark-seen
      setTimeout(() => {
        if (message.type === "dm") {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        } else {
          queryClient.invalidateQueries({ queryKey: ["rooms"] });
        }
      }, 2000);

      if (isMyMessage) return;

      // 2. In-app Notification
      if (!isCurrentPage) {
        addNotification({
          type: message.type === "dm" ? "dm" : "room_activity",
          title: `${typeof message.senderId === "object" ? message.senderId.name : "Someone"}`,
          description: message.text.substring(0, 50),
          metadata: { messageId: message._id, roomId: message.roomId, conversationId: message.conversationId }
        });
      }

      // 3. Browser Notification (if window unfocused)
      if (!isFocused) {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          new Notification(typeof message.senderId === "object" ? message.senderId.name : "New Message", {
            body: message.text,
            icon: (typeof message.senderId === "object" ? message.senderId.avatarUrl : null) || "/favicon.svg",
          });
        }
      }
    };

    const handleMessageSeenAll = ({ conversationId, seenBy }: { conversationId: string; seenBy: string }) => {
      // If we are the one who saw it, clear the unread count in global sidebars immediately
      if (seenBy === useAuthStore.getState().user?.id) {
        const clearUnread = (old: Record<string, unknown>[] | undefined) => {
           if (!old) return old;
           return old.map((c: Record<string, unknown>) => c._id === conversationId ? { ...c, unreadCount: 0 } : c);
        };
        queryClient.setQueryData(["conversations", "global"], clearUnread);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleRoomSeenAck = ({ workspaceId, roomId }: { workspaceId: string; roomId: string }) => {
       const clearUnread = (old: Record<string, unknown>[] | undefined) => {
          if (!old) return old;
          return old.map((r: Record<string, unknown>) => r._id === roomId ? { ...r, unreadCount: 0, mentionCount: 0 } : r);
       };
       queryClient.setQueryData(["rooms", workspaceId], clearUnread);
       queryClient.invalidateQueries({ queryKey: ["rooms"] });
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

    socketService.on("workspace:invited", handleInvited);
    socketService.on("message:new", handleNewMessageNotification);
    socketService.on("message:seen:all", handleMessageSeenAll);
    socketService.on("room:seen:ack", handleRoomSeenAck);

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

      socketService.off("workspace:invited", handleInvited);
      socketService.off("message:new", handleNewMessageNotification);
      socketService.off("message:seen:all", handleMessageSeenAll);
      socketService.off("room:seen:ack", handleRoomSeenAck);

      socketService.off("workspace:member-joined", handleWorkspaceMembersUpdated);
      socketService.off("workspace:member-removed", handleWorkspaceMembersUpdated);
      socketService.off("workspace:member-updated", handleWorkspaceMembersUpdated);
      socketService.off("workspace:invited", handleWorkspaceMembersUpdated);
      socketService.off("workspace:removed", handleWorkspaceMembersUpdated);

      // Explicitly disconnect when unmounting or dependencies change
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
    addNotification,
    queryClient,
    location.pathname,
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
