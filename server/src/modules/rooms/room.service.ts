import * as roomRepository from "./room.repository";
import { incrementRoomCount } from "../workspaces/workspace.repository";
import { isUserMember } from "../workspaces/workspace.service";
import type { CreateRoomInput } from "./room.types";

export const getWorkspaceRooms = async (userId: string, workspaceId: string) => {
  // Check if user is a member of the workspace
  const isMember = await isUserMember(workspaceId, userId);
  if (!isMember) {
    throw new Error("User is not a member of this workspace");
  }

  return roomRepository.findRoomsByWorkspaceId(workspaceId);
};

export const createRoom = async (
  userId: string,
  workspaceId: string,
  input: CreateRoomInput
) => {
  // Check if user is a member
  const isMember = await isUserMember(workspaceId, userId);
  if (!isMember) {
    throw new Error("User is not a member of this workspace");
  }

  const newRoom = await roomRepository.createRoom(workspaceId, userId, input);
  
  // Update workspace room count
  await incrementRoomCount(workspaceId);

  return newRoom;
};

export const getRoomById = async (userId: string, workspaceId: string, roomId: string) => {
  const isMember = await isUserMember(workspaceId, userId);
  if (!isMember) {
    throw new Error("User is not a member of this workspace");
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
