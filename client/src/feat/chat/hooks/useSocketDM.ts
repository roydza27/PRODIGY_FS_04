import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socketService } from "@/services/socket/socket.service";
import { useAuthStore } from "@/app/stores/auth.store";

import { MessageStatus } from "../types/message.types";
import type { Message } from "../types/message.types";

export const useSocketDM = (
  workspaceId?: string,
  conversationId?: string
) => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const joinDM = () => {
      socketService.joinDM(workspaceId, conversationId);
      // Mark as seen when joining
      socketService.markDMSeen(conversationId);
    };

    // Join immediately
    joinDM();

    // Rejoin after reconnect
    socketService.on("connect", joinDM);

    const handleNewMessage = (
      newMessage: Message
    ) => {
      console.log("[useSocketDM] Received message:", newMessage);

      if (
        String(newMessage.conversationId) !==
        String(conversationId)
      ) {
        console.log("[useSocketDM] Message for different conversation, ignoring");
        return;
      }

      // If message is from others, mark as delivered
      if (newMessage.senderId._id !== currentUserId) {
        console.log("[useSocketDM] Marking as delivered:", newMessage._id);
        socketService.markDMDelivered(newMessage._id, conversationId);
        
        // Also mark as seen if the window is focused
        if (document.hasFocus()) {
           socketService.markDMSeen(conversationId);
        }
      }

      queryClient.setQueryData<Message[]>(
        [
          "conversation-messages",
          conversationId,
        ],
        (previous = []) => {
          const exists = previous.some(
            (message) =>
              message._id ===
              newMessage._id
          );

          if (exists) {
            return previous;
          }

          const optimisticIndex =
            previous.findIndex(
              (message) =>
                message._id.startsWith(
                  "temp-"
                ) &&
                message.text ===
                  newMessage.text &&
                message.senderId._id ===
                  newMessage.senderId._id
            );

          if (optimisticIndex !== -1) {
            const messages = [
              ...previous,
            ];

            messages[
              optimisticIndex
            ] = newMessage;

            return messages;
          }

          return [
            ...previous,
            newMessage,
          ];
        }
      );
    };

    socketService.on(
      "message:new",
      handleNewMessage
    );

    const handleMessageStatus = ({ messageId, status }: { messageId: string, status: MessageStatus }) => {
      queryClient.setQueryData<Message[]>(
        ["conversation-messages", conversationId],
        (previous = []) => {
          return previous.map(m => m._id === messageId ? { ...m, status } : m);
        }
      );
    };

    const handleSeenAll = ({ seenBy }: { seenBy: string }) => {
      if (seenBy === currentUserId) return;

      queryClient.setQueryData<Message[]>(
        ["conversation-messages", conversationId],
        (previous = []) => {
          return previous.map(m => 
            m.senderId._id === currentUserId && m.status !== MessageStatus.SEEN 
              ? { ...m, status: MessageStatus.SEEN } 
              : m
          );
        }
      );
    };

    socketService.on("message:status", handleMessageStatus);
    socketService.on("message:seen:all", handleSeenAll);

    return () => {
      socketService.off(
        "connect",
        joinDM
      );

      socketService.leaveDM(
        conversationId
      );

      socketService.off(
        "message:new",
        handleNewMessage
      );

      socketService.off("message:status", handleMessageStatus);
      socketService.off("message:seen:all", handleSeenAll);
    };
  }, [
    workspaceId,
    conversationId,
    queryClient,
    currentUserId,
  ]);
};
