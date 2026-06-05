import { useQuery } from "@tanstack/react-query";

import { getRoomMessages } from "../api/message.api";

export const useRoomMessages = (
  workspaceId?: string,
  roomId?: string
) => {
  return useQuery({
    queryKey: ["messages", roomId],

    queryFn: () =>
      getRoomMessages(workspaceId!, roomId!),

    enabled: !!workspaceId && !!roomId,
  });
};