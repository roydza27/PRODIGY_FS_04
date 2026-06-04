import { api } from "@/services/api";
import type { Room, CreateRoomInput } from "../types";

export const roomsApi = {
  getWorkspaceRooms: async (workspaceId: string): Promise<Room[]> => {
    const { data } = await api.get(`/api/workspaces/${workspaceId}/rooms`);
    return data.data;
  },

  createRoom: async (workspaceId: string, input: CreateRoomInput): Promise<Room> => {
    const { data } = await api.post(`/api/workspaces/${workspaceId}/rooms`, input);
    return data.data;
  },

  getRoomById: async (workspaceId: string, roomId: string): Promise<Room> => {
    const { data } = await api.get(`/api/workspaces/${workspaceId}/rooms/${roomId}`);
    return data.data;
  },
};
