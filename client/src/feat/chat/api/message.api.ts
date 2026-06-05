import { api } from "@/services/api";

import type { MessagesResponse } from "../types/message.types";

export const getRoomMessages = async (
  workspaceId: string,
  roomId: string
): Promise<MessagesResponse> => {
  const { data } = await api.get(
    `/messages/room/${roomId}`
  );

  return data;
};