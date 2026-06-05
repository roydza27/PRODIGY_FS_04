import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRoom } from "../api/room.api";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.workspaceId],
      });
    },
  });
};