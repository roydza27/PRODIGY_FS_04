import { useQuery } from "@tanstack/react-query";
import { getConversation } from "../api/conversation.api";

export const useConversation = (conversationId?: string, workspaceId?: string) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId!, workspaceId),
    enabled: !!conversationId,
  });
};
