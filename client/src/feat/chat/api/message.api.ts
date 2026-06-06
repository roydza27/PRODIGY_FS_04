import { api } from "@/services/api";
import type { Message } from "../types/message.types";

export const getRoomMessages = async (
  workspaceId: string,
  roomId: string
): Promise<Message[]> => {
  const { data } = await api.get(
    `/messages/room/${roomId}`
  );

  return data;
};

export const getConversationMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const { data } = await api.get(
    `/messages/conversation/${conversationId}`
  );

  return data;
};