import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socketService } from "@/services/socket/socket.service";
import type { Message } from "../types/message.types";

export function useSocketRoom(
  workspaceId?: string,
  roomId?: string
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId || !roomId) {
      return;
    }

    const joinRoom = () => {
      socketService.joinWorkspace(workspaceId);
      socketService.joinRoom(workspaceId, roomId);
    };

    // Join immediately
    joinRoom();

    const handleNewMessage = (message: Message) => {
      const messageRoomId =
        typeof message.roomId === "string"
          ? message.roomId
          : (message.roomId as { _id?: string })?._id;

      // Ignore messages from other rooms
      if (String(messageRoomId) !== String(roomId)) {
        return;
      }

      queryClient.setQueryData<Message[]>(
        ["messages", roomId],
        (previous = []) => {
          // Prevent duplicates
          if (
            previous.some(
              (item) => item._id === message._id
            )
          ) {
            return previous;
          }

          /**
           * Keep the same ordering as the API.
           * If your API returns newest first,
           * prepend the new message.
           */
          return [message, ...previous];
        }
      );
    };

    // Rejoin after reconnect
    socketService.on("connect", joinRoom);

    // Listen for realtime messages
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

      socketService.leaveRoom(roomId);
    };
  }, [
    workspaceId,
    roomId,
    queryClient,
  ]);
}