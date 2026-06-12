import { useQuery } from "@tanstack/react-query";
import {
  getRoomSharedFiles,
  getConversationSharedFiles,
} from "../api/sharedFiles.api";

/**
 * React Query hook to fetch all shared file messages for a Room.
 * Results are cached under ["shared-files", "room", roomId].
 */
export function useRoomSharedFiles(roomId?: string) {
  return useQuery({
    queryKey: ["shared-files", "room", roomId],
    queryFn: () => getRoomSharedFiles(roomId!),
    enabled: !!roomId,
    staleTime: 30_000,
  });
}

/**
 * React Query hook to fetch all shared file messages for a DM conversation.
 * Results are cached under ["shared-files", "dm", conversationId].
 */
export function useConversationSharedFiles(conversationId?: string) {
  return useQuery({
    queryKey: ["shared-files", "dm", conversationId],
    queryFn: () => getConversationSharedFiles(conversationId!),
    enabled: !!conversationId,
    staleTime: 30_000,
  });
}
