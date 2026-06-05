import { api } from "@/services/api";

import type {
  CreateRoomPayload,
  UpdateRoomPayload,
  RoomResponse,
  RoomsResponse,
} from "../types/room.types";

export const getWorkspaceRooms = async (
  workspaceId: string
): Promise<RoomsResponse> => {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/rooms`
  );

  return data;
};

export const getRoom = async (
  workspaceId: string,
  roomId: string
): Promise<RoomResponse> => {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/rooms/${roomId}`
  );

  return data;
};

export const createRoom = async (
  payload: CreateRoomPayload
): Promise<RoomResponse> => {
  const { workspaceId, ...roomData } = payload;

  const { data } = await api.post(
    `/workspaces/${workspaceId}/rooms`,
    roomData
  );

  return data;
};

export const updateRoom = async (
  payload: UpdateRoomPayload
): Promise<RoomResponse> => {
  const { workspaceId, roomId, ...updates } =
    payload;

  const { data } = await api.patch(
    `/workspaces/${workspaceId}/rooms/${roomId}`,
    updates
  );

  return data;
};

export const deleteRoom = async (
  workspaceId: string,
  roomId: string
) => {
  const { data } = await api.delete(
    `/workspaces/${workspaceId}/rooms/${roomId}`
  );

  return data;
};