import type { IRoom, CreateRoomInput } from "./room.types";
import { RoomModel } from "./room.model";

export const findRoomById = async (roomId: string): Promise<IRoom | null> => {
  return RoomModel.findById(roomId).lean();
};

export const findRoomsByWorkspaceId = async (
  workspaceId: string,
  status: "active" | "archived" | "all" = "active"
): Promise<IRoom[]> => {
  const query: Record<string, unknown> = { workspaceId };

  if (status !== "all") {
    query.status = status;
  }

  return RoomModel.find(query).sort({ createdAt: 1 }).lean();
};

export const createRoom = async (
  workspaceId: string,
  userId: string,
  input: CreateRoomInput
): Promise<IRoom> => {
  const room = await RoomModel.create({
    workspaceId,
    name: input.name.trim(),
    description: input.description?.trim() || "",
    type: input.type || "text",
    isPrivate: input.isPrivate || false,
    createdBy: userId,
    status: "active",
  });

  return room.toObject();
};

export const updateRoom = async (
  roomId: string,
  updates: {
    name?: string;
    description?: string;
  }
): Promise<IRoom | null> => {
  return RoomModel.findByIdAndUpdate(
    roomId,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

export const deleteRoom = async (
  roomId: string
): Promise<IRoom | null> => {
  return RoomModel.findByIdAndDelete(roomId).lean();
};
