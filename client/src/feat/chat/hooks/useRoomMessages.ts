import { useQuery } from "@tanstack/react-query";

import { getRoomMessages } from "../api/message.api";

export function useRoomMessages(
  workspaceId?: string,
  roomId?: string
) {
  return useQuery({
    queryKey: ["messages", roomId],

    queryFn: async () => {
      if (!workspaceId || !roomId) {
        throw new Error(
          "Workspace ID and Room ID are required"
        );
      }

      return getRoomMessages(
        workspaceId,
        roomId
      );
    },

    enabled: Boolean(
      workspaceId && roomId
    ),

    staleTime: 30 * 1000,
  });
}