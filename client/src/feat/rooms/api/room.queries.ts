import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRoom,
  getRoom,
  getWorkspaceRooms,
  updateRoom,
  deleteRoom,
} from "./room.api";

import type { CreateRoomPayload } from "../types/room.types";

export const roomKeys = {
  all: ["rooms"] as const,

  list: (workspaceId: string) =>
    [...roomKeys.all, workspaceId] as const,

  detail: (workspaceId: string, roomId: string) =>
    [...roomKeys.list(workspaceId), roomId] as const,
};

export const useGetRooms = (
  workspaceId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: roomKeys.list(workspaceId),

    queryFn: async () => {
      const response = await getWorkspaceRooms(workspaceId);

      return response.data;
    },

    enabled: enabled && !!workspaceId,
  });
};

export const useGetRoom = (
  workspaceId: string,
  roomId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: roomKeys.detail(workspaceId, roomId),

    queryFn: async () => {
      const response = await getRoom(
        workspaceId,
        roomId
      );

      return response.data;
    },

    enabled:
      enabled &&
      !!workspaceId &&
      !!roomId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoomPayload) =>
      createRoom(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roomKeys.list(
          variables.workspaceId
        ),
      });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoom,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roomKeys.list(
          variables.workspaceId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: roomKeys.detail(
          variables.workspaceId,
          variables.roomId
        ),
      });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      roomId,
    }: {
      workspaceId: string;
      roomId: string;
    }) =>
      deleteRoom(workspaceId, roomId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roomKeys.list(
          variables.workspaceId
        ),
      });
    },
  });
};