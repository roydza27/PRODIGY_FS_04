import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socketService } from "@/services/socket/socket.service";

import type { Message } from "../types/message.types";

export const useSocketDM = (
  workspaceId?: string,
  conversationId?: string
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const joinDM = () => {
      socketService.joinDM(workspaceId, conversationId);
    };

    // Join immediately
    joinDM();

    // Rejoin after reconnect
    socketService.on("connect", joinDM);

    const handleNewMessage = (
      newMessage: Message
    ) => {
      console.log(
        "[CLIENT] received",
        newMessage
      );

      if (
        String(newMessage.conversationId) !==
        String(conversationId)
      ) {
        return;
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
    };
  }, [
    workspaceId,
    conversationId,
    queryClient,
  ]);
};
