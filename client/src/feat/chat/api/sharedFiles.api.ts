import { api } from "@/services/api";
import type { Message } from "@/feat/chat/types/message.types";

/**
 * Fetches all messages with attachments for a given room.
 * Used by the SharedFilesPanel.
 */
export const getRoomSharedFiles = async (
  roomId: string
): Promise<Message[]> => {
  const { data } = await api.get<Message[]>(
    `/messages/room/${roomId}/files`
  );
  return data;
};

/**
 * Fetches all messages with attachments for a given DM conversation.
 * Used by the SharedFilesPanel.
 */
export const getConversationSharedFiles = async (
  conversationId: string
): Promise<Message[]> => {
  const { data } = await api.get<Message[]>(
    `/messages/conversation/${conversationId}/files`
  );
  return data;
};
