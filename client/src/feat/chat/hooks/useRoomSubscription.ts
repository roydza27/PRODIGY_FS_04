import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket/socket.service";
import { useAuthStore } from "@/app/stores/auth.store";
import type { Message, MessagesResponse } from "../types/message.types";

export const useRoomSubscription = (workspaceId?: string, roomId?: string) => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Connect if not already connected
    socketService.connect(token);

    const socket = socketService.getSocket();
    if (!socket) return;

    if (workspaceId && roomId) {
      // Join room
      socketService.emit("room:join", { workspaceId, roomId });

      // Listen for new messages
      const handleNewMessage = (newMessage: Message) => {
        // Only update if it belongs to the current room
        if (newMessage.roomId === roomId) {
          queryClient.setQueryData<MessagesResponse>(
            ["messages", roomId],
            (oldData) => {
              if (!oldData) return [newMessage];
              
              // Prevent duplicates (e.g. if optimistic update already added it)
              const exists = oldData.some((m) => m._id === newMessage._id);
              if (exists) return oldData;

              return [newMessage, ...oldData];
            }
          );
        }
      };

      socketService.on("message:new", handleNewMessage);

      return () => {
        socketService.emit("room:leave", { workspaceId, roomId });
        socketService.off("message:new", handleNewMessage);
      };
    }
  }, [isAuthenticated, token, workspaceId, roomId, queryClient]);
};
