import mongoose from "mongoose";
import type { IRoom, CreateRoomInput } from "./room.types";
import { RoomModel } from "./room.model";
import { MessageModel } from "../messages/models/message.model";
import { MembershipModel } from "../workspaces/membership.model";

export const findRoomById = async (roomId: string): Promise<IRoom | null> => {
  return RoomModel.findById(roomId).lean();
};

export const findRoomsByWorkspaceId = async (
  workspaceId: string,
  userId?: string,
  status: "active" | "archived" | "all" = "active"
): Promise<any[]> => {
  const query: Record<string, unknown> = { workspaceId };

  if (status !== "all") {
    query.status = status;
  }

  const rooms = await RoomModel.find(query)
    .sort({ lastMessageAt: -1 })
    .populate({
      path: "lastMessage",
      populate: { path: "senderId", select: "name" },
    })
    .lean();

  if (!userId) return rooms;

  // Enhance with unread info
  const membership = await MembershipModel.findOne({ workspaceId, userId }).lean();
  const roomLastRead = (membership?.roomLastRead as Record<string, Date>) || {};
  const userObjId = new mongoose.Types.ObjectId(userId);

  const enrichedRooms = await Promise.all(
    rooms.map(async (room) => {
      const lastReadAt = roomLastRead[room._id.toString()] || new Date(0);
      
      const [unreadCount, mentionCount] = await Promise.all([
        MessageModel.countDocuments({
          roomId: room._id,
          senderId: { $ne: userObjId },
          createdAt: { $gt: lastReadAt },
        }),
        MessageModel.countDocuments({
          roomId: room._id,
          senderId: { $ne: userObjId },
          createdAt: { $gt: lastReadAt },
          $or: [
            { text: new RegExp(`@${membership?.nickname || ""}`, "i") },
            // We'll need user's actual username/name here too if nickname isn't enough
          ]
        }),
      ]);

      return {
        ...room,
        unreadCount,
        mentionCount,
      };
    })
  );

  return enrichedRooms;
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
