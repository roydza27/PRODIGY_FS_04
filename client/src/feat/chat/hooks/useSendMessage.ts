import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/app/stores/auth.store";
import { socketService } from "@/services/socket/socket.service";

import { MessageStatus } from "../types/message.types";
import type { Message, IAttachment, MessageContentType } from "../types/message.types";

export function useSendMessage(
  workspaceId?: string,
  roomId?: string,
  conversationId?: string
) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const sendMessage = useCallback(
    (text: string, attachments: IAttachment[] = []) => {
      if (!workspaceId || !user) {
        return;
      }

      if (!roomId && !conversationId) {
        return;
      }

      const trimmedText = text.trim();

      // Must have text OR at least one attachment
      if (!trimmedText && attachments.length === 0) {
        return;
      }

      // Derive messageType
      const messageType: MessageContentType = (() => {
        if (attachments.length === 0) return "TEXT";
        if (attachments.some((a) => a.type === "VIDEO")) return "VIDEO";
        if (attachments.some((a) => a.type === "IMAGE")) return "IMAGE";
        if (attachments.some((a) => a.type === "DOCUMENT")) return "DOCUMENT";
        return "FILE";
      })();

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
        messageType,
        text: trimmedText || undefined,
        attachments,
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
        messageType,
        attachments,
      });
    },
    [workspaceId, roomId, conversationId, queryClient, user]
  );

  return { sendMessage };
}