import { useState, useCallback } from "react";
import { roomsApi } from "../api/rooms.api";
import type { Room, CreateRoomInput } from "../types";

export const useRooms = (workspaceId?: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await roomsApi.getWorkspaceRooms(workspaceId);
      setRooms(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to fetch rooms");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  const createRoom = async (input: CreateRoomInput) => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const newRoom = await roomsApi.createRoom(workspaceId, input);
      setRooms((prev) => [...prev, newRoom]);
      return newRoom;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to create room");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rooms,
    isLoading,
    error,
    fetchRooms,
    createRoom,
  };
};
