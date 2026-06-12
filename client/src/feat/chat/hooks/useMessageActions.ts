import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMessage, deleteMessage } from "../api/message.api";
import type { Message } from "../types/message.types";
import { toast } from "sonner";

export function useMessageActions(roomId?: string, conversationId?: string) {
  const queryClient = useQueryClient();

  const queryKey = roomId 
    ? ["messages", roomId] 
    : ["conversation-messages", conversationId];

  const editMutation = useMutation({
    mutationFn: ({ messageId, text }: { messageId: string; text: string }) => 
      updateMessage(messageId, text),
    onSuccess: (updatedMessage) => {
      queryClient.setQueryData<Message[]>(queryKey, (old = []) => 
        old.map(m => m._id === updatedMessage._id ? updatedMessage : m)
      );
    },
    onError: () => {
      toast.error("Failed to edit message");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: (deletedMessage) => {
      queryClient.setQueryData<Message[]>(queryKey, (old = []) => 
        old.map(m => m._id === deletedMessage._id ? deletedMessage : m)
      );
    },
    onError: () => {
      toast.error("Failed to delete message");
    }
  });

  return {
    editMessage: editMutation.mutateAsync,
    isEditing: editMutation.isPending,
    deleteMessage: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
