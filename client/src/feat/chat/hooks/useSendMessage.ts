import { useCallback } from "react";
import { socketService } from "@/services/socket/socket.service";

export const useSendMessage = (
  workspaceId?: string,
  roomId?: string,
  conversationId?: string
) => {
  const sendMessage = useCallback(
    (text: string) => {
      if (!workspaceId || (!roomId && !conversationId) || !text.trim()) return;

      socketService.emit("message:send", {
        workspaceId,
        roomId,
        conversationId,
        text: text.trim(),
        type: conversationId ? "dm" : "room",
      });
    },
    [workspaceId, roomId, conversationId]
  );

  return { sendMessage };
};
