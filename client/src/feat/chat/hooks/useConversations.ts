import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../api/conversation.api";

export const useConversations = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["conversations", workspaceId || "global"],
    queryFn: () => getConversations(workspaceId),
  });
};
