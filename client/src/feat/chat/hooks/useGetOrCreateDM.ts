import { useQuery } from "@tanstack/react-query";

import { getOrCreateDM } from "../api/conversation.api";

export const useGetOrCreateDM = (
  userId?: string
) => {
  return useQuery({
    queryKey: ["conversation", "dm", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      return getOrCreateDM(userId);
    },
  });
};