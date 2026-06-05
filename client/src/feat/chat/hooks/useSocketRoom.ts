import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket/socket.service";
import type { Message } from "../types/message.types";

export const useSocketRoom = (workspaceId?: string, roomId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId || !roomId) return;

    const joinRoom = () => {
      socketService.emit("workspace:join", { workspaceId });
      socketService.emit("room:join", { workspaceId, roomId });
    };

    // Join immediately
    joinRoom();

    // Listen for reconnection to rejoin
    const socket = socketService.getSocket();
    socket.on("connect", joinRoom);

    // Listen for new messages
    const handleNewMessage = (newMessage: Message) => {
      // Ensure the message belongs to the current room
      // Handle potential ObjectId vs string comparison
      if (String(newMessage.roomId) !== String(roomId)) {
        return;
      }

      // Update React Query cache
      queryClient.setQueryData<Message[]>(["messages", roomId], (oldData) => {
        if (!oldData) return [newMessage];
        
        // Prevent duplicates from multiple socket events
        if (oldData.some((msg) => msg._id === newMessage._id)) {
          return oldData;
        }

        // Try to replace optimistic message if it exists
        // We look for a message with the same text and sender that has a temp id
        const optimisticIndex = oldData.findIndex(
          (msg) => 
            msg._id.startsWith("temp-") && 
            msg.text === newMessage.text && 
            msg.senderId._id === newMessage.senderId._id
        );

        if (optimisticIndex !== -1) {
          const newData = [...oldData];
          newData[optimisticIndex] = newMessage;
          return newData;
        }
        
        return [newMessage, ...oldData];
      });
    };

    socketService.on("message:new", handleNewMessage);

    return () => {
      socket.off("connect", joinRoom);
      socketService.emit("room:leave", { workspaceId, roomId });
      socketService.off("message:new", handleNewMessage);
    };
  }, [workspaceId, roomId, queryClient]);
};
