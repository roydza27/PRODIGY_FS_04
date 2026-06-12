import { api } from "@/services/api";
import type { Message } from "../types/message.types";

export const getRoomMessages = async (
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

export const updateMessage = async (
  messageId: string,
  text: string
): Promise<Message> => {
  const { data } = await api.patch(
    `/messages/${messageId}`,
    { text }
  );

  return data;
};

export const deleteMessage = async (
  messageId: string
): Promise<Message> => {
  const { data } = await api.delete(
    `/messages/${messageId}`
  );

  return data;
};

export const searchMessages = async (
  query: string
): Promise<Message[]> => {
  const { data } = await api.get(
    `/messages/search?q=${encodeURIComponent(query)}`
  );

  return data;
};