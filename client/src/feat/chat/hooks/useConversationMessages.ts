import { useQuery } from "@tanstack/react-query";
import { getConversationMessages } from "../api/message.api";

export const useConversationMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
  });
};
