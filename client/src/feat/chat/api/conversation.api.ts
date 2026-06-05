import { api } from "@/services/api";
import type { Conversation, CreateConversationInput } from "../types/conversation.types";

export const getConversations = async (workspaceId: string): Promise<Conversation[]> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/conversations`);
  return data;
};

export const getOrCreateDM = async (
  workspaceId: string,
  input: CreateConversationInput
): Promise<Conversation> => {
  const { data } = await api.post(`/workspaces/${workspaceId}/conversations`, input);
  return data;
};

export const getConversation = async (
  workspaceId: string,
  conversationId: string
): Promise<Conversation> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/conversations/${conversationId}`);
  return data;
};
