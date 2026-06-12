import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { logger } from "@/utils/logger";
import { useAuthStore } from "@/app/stores/auth.store";
import { socketService } from "@/services/socket/socket.service";

import { MessageStatus } from "../types/message.types";
import type { Message } from "../types/message.types";

export function useSendMessage(
  workspaceId?: string,
  roomId?: string,
  conversationId?: string
) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const sendMessage = useCallback(
    (text: string) => {
      if (!workspaceId || !user) {
        logger.warn("[useSendMessage] Missing workspaceId or user", { workspaceId, user });
        return;
      }

      if (!roomId && !conversationId) {
        logger.warn("[useSendMessage] Missing roomId and conversationId");
        return;
      }

      const trimmedText = text.trim();

      if (!trimmedText) {
        return;
      }

      // Create optimistic message
      const tempId = `temp-${Date.now()}`;

      const optimisticMessage: Message = {
        _id: tempId,
        workspaceId,
        roomId,
        conversationId,
        senderId: {
          _id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        type: conversationId ? "dm" : "room",
        text: trimmedText,
        status: MessageStatus.SENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update cache
      const queryKey = roomId
        ? ["messages", roomId]
        : ["conversation-messages", conversationId];

      queryClient.setQueryData<Message[]>(
        queryKey,
        (old = []) => [...old, optimisticMessage]
      );

      socketService.sendMessage({
        workspaceId,
        roomId,
        conversationId,
        text: trimmedText,
      });
    },
    [
      workspaceId,
      roomId,
      conversationId,
      queryClient,
      user,
    ]
  );

  return {
    sendMessage,
  };
}