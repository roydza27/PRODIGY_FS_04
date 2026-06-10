import { api } from "@/services/api";
import type { Conversation, CreateConversationInput } from "../types/conversation.types";

export const getConversations = async (workspaceId?: string): Promise<Conversation[]> => {
  const url = workspaceId 
    ? `/workspaces/${workspaceId}/conversations` 
    : "/conversations/list";
  const { data } = await api.get(url);
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
  conversationId: string,
  workspaceId?: string
): Promise<Conversation> => {
  const url = workspaceId
    ? `/workspaces/${workspaceId}/conversations/${conversationId}`
    : `/conversations/${conversationId}`;
  const { data } = await api.get(url);
  return data;
};
