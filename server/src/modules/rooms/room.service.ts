import mongoose from "mongoose";
import * as roomRepository from "./room.repository";
import * as membershipRepository from "../workspaces/membership.repository";
import { incrementRoomCount } from "../workspaces/workspace.repository";
import { isUserMember } from "../workspaces/workspace.service";
import type { CreateRoomInput } from "./room.types";

export const getWorkspaceRooms = async (userId: string, workspaceId: string) => {
  // Check if user is a member of the workspace
  const isMember = await isUserMember(workspaceId, userId);
  if (!isMember) {
    throw new Error("User is not a member of this workspace");
  }

  return roomRepository.findRoomsByWorkspaceId(workspaceId, userId);
};

export const createRoom = async (
  userId: string,
  workspaceId: string,
  input: CreateRoomInput
) => {
  const isMember = await isUserMember(
    workspaceId,
    userId
  );

  if (!isMember) {
    throw new Error(
      "User is not a member of this workspace"
    );
  }

  const role =
    await membershipRepository.getUserRoleInWorkspace(
      workspaceId,
      userId
    );

  if (!role) {
    throw new Error(
      "Unable to determine user role"
    );
  }

  if (!["owner", "admin"].includes(role)) {
    throw new Error(
      "You do not have permission to create rooms"
    );
  }

  try {
    const newRoom =
      await roomRepository.createRoom(
        workspaceId,
        userId,
        input
      );

    await incrementRoomCount(workspaceId);

    return newRoom;
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err?.code === 11000) {
      throw new Error(
        "A room with this name already exists",
        { cause: error }
      );
    }

    throw error;
  }
};

export const getRoomById = async (userId: string, workspaceId: string, roomId: string) => {
  const isMember = await isUserMember(workspaceId, userId);
  if (!isMember) {
    throw new Error("User is not a member of this workspace");
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new Error("Invalid room ID");
  }

  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  if (room.workspaceId.toString() !== workspaceId) {
    throw new Error("Room does not belong to this workspace");
  }

  return room;
};

export const updateRoom = async (
  userId: string,
  workspaceId: string,
  roomId: string,
  updates: {
    name?: string;
    description?: string;
  }
) => {
  const isMember = await isUserMember(
    workspaceId,
    userId
  );

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new Error("Invalid room ID");
  }

  if (!isMember) {
    throw new Error(
      "User is not a member of this workspace"
    );
  }

  const role =
    await membershipRepository.getUserRoleInWorkspace(
      workspaceId,
      userId
    );

  if (!role || !["owner", "admin"].includes(role)) {
    throw new Error(
      "You do not have permission to update rooms"
    );
  }

  const room =
    await roomRepository.findRoomById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.workspaceId.toString() !== workspaceId) {
    throw new Error(
      "Room does not belong to this workspace"
    );
  }

  const updatedRoom =
    await roomRepository.updateRoom(
      roomId,
      updates
    );

  return updatedRoom;
};

export const deleteRoom = async (
  userId: string,
  workspaceId: string,
  roomId: string
) => {
  const isMember = await isUserMember(
    workspaceId,
    userId
  );

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new Error("Invalid room ID");
  }

  if (!isMember) {
    throw new Error(
      "User is not a member of this workspace"
    );
  }

  const role =
    await membershipRepository.getUserRoleInWorkspace(
      workspaceId,
      userId
    );

  if (role !== "owner") {
    throw new Error(
      "Only workspace owners can delete rooms"
    );
  }

  const room =
    await roomRepository.findRoomById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.workspaceId.toString() !== workspaceId) {
    throw new Error(
      "Room does not belong to this workspace"
    );
  }

  if ((room as { isDefault?: boolean }).isDefault) {
    throw new Error(
      "Default room cannot be deleted"
    );
  }

  return roomRepository.deleteRoom(roomId);
};