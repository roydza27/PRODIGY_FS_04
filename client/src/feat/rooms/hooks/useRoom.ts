import { useQuery } from "@tanstack/react-query";

import { getRoom } from "../api/room.api";

export const useRoom = (
  workspaceId?: string,
  roomId?: string
) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(workspaceId!, roomId!),
    enabled: !!workspaceId && !!roomId,
  });
};