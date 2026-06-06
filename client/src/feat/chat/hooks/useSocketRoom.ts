import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socketService } from "@/services/socket/socket.service";

import type {
  Message,
  MessagesResponse,
} from "../types/message.types";

export function useSocketRoom(
  workspaceId?: string,
  roomId?: string
) {
  const queryClient =
    useQueryClient();

  useEffect(() => {
    if (!workspaceId || !roomId) {
      return;
    }

    const joinRoom = () => {
      socketService.joinWorkspace(
        workspaceId
      );

      socketService.joinRoom(
        workspaceId,
        roomId
      );
    };

    // Join immediately
    joinRoom();

    // Rejoin after reconnect
    socketService.on(
      "connect",
      joinRoom
    );

    const handleNewMessage = (
      message: Message
    ) => {
      console.log(
        "[CLIENT] received",
        message
      );

      const messageRoomId =
        typeof message.roomId ===
        "string"
          ? message.roomId
          : (
              message.roomId as {
                _id?: string;
              }
            )?._id;

      if (
        String(messageRoomId) !==
        String(roomId)
      ) {
        return;
      }

      queryClient.setQueryData<MessagesResponse>(
        ["messages", roomId],
        (previous = []) => {
          const exists =
            previous.some(
              (item) =>
                item._id ===
                message._id
            );

          if (exists) {
            return previous;
          }

          const optimisticIndex =
            previous.findIndex(
              (item) =>
                item._id.startsWith(
                  "temp-"
                ) &&
                item.text ===
                  message.text &&
                item.senderId._id ===
                  message.senderId._id
            );

          if (
            optimisticIndex !== -1
          ) {
            const messages = [
              ...previous,
            ];

            messages[
              optimisticIndex
            ] = message;

            return messages;
          }

          return [
            ...previous,
            message,
          ];
        }
      );
    };

    socketService.on<Message>(
      "message:new",
      handleNewMessage
    );

    return () => {
      socketService.off(
        "connect",
        joinRoom
      );

      socketService.off<Message>(
        "message:new",
        handleNewMessage
      );

      socketService.leaveRoom(
        roomId
      );
    };
  }, [
    workspaceId,
    roomId,
    queryClient,
  ]);
}