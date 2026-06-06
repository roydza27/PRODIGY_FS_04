import { useEffect } from "react";

import { socketService } from "@/services/socket/socket.service";

interface UseRoomSubscriptionProps<T = unknown> {
  workspaceId?: string;
  roomId?: string;
  enabled?: boolean;
  onMessage: (message: T) => void;
}

export function useRoomSubscription<T = unknown>({
  workspaceId,
  roomId,
  enabled = true,
  onMessage,
}: UseRoomSubscriptionProps<T>) {
  useEffect(() => {
    if (!enabled) return;

    if (!workspaceId || !roomId) return;

    socketService.joinWorkspace(workspaceId);
    socketService.joinRoom(workspaceId, roomId);

    socketService.on("message:new", onMessage);

    return () => {
      socketService.off("message:new", onMessage);
      socketService.leaveRoom(roomId);
    };
  }, [
    workspaceId,
    roomId,
    enabled,
    onMessage,
  ]);
}