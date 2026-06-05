import { useQuery } from "@tanstack/react-query";

import { getWorkspaceRooms } from "../api/room.api";

export const useRooms = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["rooms", workspaceId],
    queryFn: async () => {
      const response =
        await getWorkspaceRooms(workspaceId!);
      return response.data;
    },
    enabled: !!workspaceId,
  });
};