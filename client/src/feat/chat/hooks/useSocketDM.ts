import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socket/socket.service";
import type { Message } from "../types/message.types";

export const useSocketDM = (workspaceId?: string, conversationId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId || !conversationId) return;

    const joinDM = () => {
      socketService.emit("workspace:join", { workspaceId });
      socketService.emit("dm:join", { conversationId });
    };

    // Join immediately
    joinDM();

    // Listen for reconnection to rejoin
    const socket = socketService.getSocket();
    socket.on("connect", joinDM);

    // Listen for new messages
    const handleNewMessage = (newMessage: Message) => {
      // Ensure the message belongs to the current conversation
      if (String(newMessage.conversationId) !== String(conversationId)) {
        return;
      }

      // Update React Query cache
      queryClient.setQueryData<Message[]>(["messages", conversationId], (oldData) => {
        if (!oldData) return [newMessage];
        
        // Prevent duplicates from multiple socket events
        if (oldData.some((msg) => msg._id === newMessage._id)) {
          return oldData;
        }

        // Try to replace optimistic message if it exists
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
      socket.off("connect", joinDM);
      socketService.emit("dm:leave", { conversationId });
      socketService.off("message:new", handleNewMessage);
    };
  }, [workspaceId, conversationId, queryClient]);
};
