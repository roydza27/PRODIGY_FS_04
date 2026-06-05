import * as roomRepository from "../../rooms/room.repository";
import * as messageRepository from "../repositories/message.repository";
import mongoose from "mongoose";

export const getRoomHistory = async (
  roomId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw "Invalid room id";
  }

  const room = await roomRepository.findRoomById(roomId);

  if (!room) {
    throw "Room not found";
  }

  return messageRepository.findRoomMessages(roomId);
};

export const getConversationHistory = async (
  conversationId: string
) => {
  return messageRepository.findConversationMessages(
    conversationId
  );
};