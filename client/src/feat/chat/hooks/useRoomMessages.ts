import { useQuery } from "@tanstack/react-query";

import { getRoomMessages } from "../api/message.api";

export function useRoomMessages(
  workspaceId?: string,
  roomId?: string
) {
  return useQuery({
    queryKey: ["messages", roomId],

    queryFn: () => {
      return getRoomMessages(
        workspaceId!,
        roomId!
      );
    },

    enabled: Boolean(workspaceId && roomId),

    staleTime: 30 * 1000,
  });
}