import { useQuery } from "@tanstack/react-query";
import { getConversationMessages } from "../api/message.api";

export const useConversationMessages = (
  conversationId?: string
) => {
  return useQuery({
    queryKey: [
      "conversation-messages",
      conversationId,
    ],
    queryFn: async () => {
      if (!conversationId) {
        throw new Error(
          "Conversation ID is required"
        );
      }

      return getConversationMessages(
        conversationId
      );
    },
    enabled: Boolean(conversationId),
  });
};
