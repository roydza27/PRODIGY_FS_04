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
      const messageRoomId =
        typeof message.roomId ===
        "string"
          ? message.roomId
          : (
              message.roomId as unknown as {
                _id?: string;
              }
            )?._id;

      if (
        String(messageRoomId) !==
        String(roomId)
      ) {
        return;
      }

      // Mark as seen if the window is focused
      if (document.hasFocus()) {
         socketService.markRoomSeen(workspaceId, roomId);
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

    const handleMessageUpdated = (
      updatedMessage: Message
    ) => {
      const messageRoomId =
        typeof updatedMessage.roomId === "string"
          ? updatedMessage.roomId
          : (updatedMessage.roomId as unknown as { _id?: string })?._id;

      if (String(messageRoomId) !== String(roomId)) {
        return;
      }

      queryClient.setQueryData<MessagesResponse>(
        ["messages", roomId],
        (previous = []) => {
          return previous.map(m => m._id === updatedMessage._id ? updatedMessage : m);
        }
      );
    };

    socketService.on<Message>(
      "message:new",
      handleNewMessage
    );

    socketService.on<Message>(
      "message:updated",
      handleMessageUpdated
    );

    // Mark as seen when window focuses
    const handleFocus = () => {
      socketService.markRoomSeen(workspaceId, roomId);
      queryClient.setQueryData(["rooms", workspaceId], (old: Record<string, unknown>[] | undefined) => {
         if (!old) return old;
         return old.map((r: Record<string, unknown>) => r._id === roomId ? { ...r, unreadCount: 0, mentionCount: 0 } : r);
      });
      // Also invalidate to sync with backend
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["rooms"] }), 300);
    };

    window.addEventListener("focus", handleFocus);
    
    // Also mark as seen initially when joining
    handleFocus();

    return () => {
      window.removeEventListener("focus", handleFocus);
      
      socketService.off(
        "connect",
        joinRoom
      );

      socketService.off<Message>(
        "message:new",
        handleNewMessage
      );

      socketService.off<Message>(
        "message:updated",
        handleMessageUpdated
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