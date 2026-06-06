import { useQuery } from "@tanstack/react-query";
import { getConversation } from "../api/conversation.api";

export const useConversation = (workspaceId?: string, conversationId?: string) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(workspaceId!, conversationId!),
    enabled: !!workspaceId && !!conversationId,
  });
};
