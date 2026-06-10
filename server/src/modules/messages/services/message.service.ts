import * as roomRepository from "../../rooms/room.repository";
import * as messageRepository from "../repositories/message.repository";
import * as conversationRepository from "../../conversations/conversation.repository";
import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";
import type { CreateMessageInput } from "../types/message.types";

export const sendMessage = async (input: CreateMessageInput) => {
  const message = await messageRepository.createMessage(input);

  // If it's a DM, update the conversation's lastMessageAt
  if (input.type === "dm" && input.conversationId) {
    await conversationRepository.updateLastMessageAt(
      input.conversationId
    );
  }

  // Re-fetch with population to ensure client gets full sender info
  return MessageModel.findById(message._id)
    .populate("senderId", "name avatarUrl")
    .lean()
    .exec();
};

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