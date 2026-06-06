import { useCallback } from "react";

import { socketService } from "@/services/socket/socket.service";

export function useSendMessage(
  workspaceId?: string,
  roomId?: string,
  conversationId?: string
) {
  const sendMessage = useCallback(
    (text: string) => {
      if (!workspaceId) {
        return;
      }

      if (!roomId && !conversationId) {
        return;
      }

      const message = text.trim();

      if (!message) {
        return;
      }

      socketService.sendMessage({
        workspaceId,
        roomId,
        conversationId,
        text: message,
      });
    },
    [workspaceId, roomId, conversationId]
  );

  return {
    sendMessage,
  };
}