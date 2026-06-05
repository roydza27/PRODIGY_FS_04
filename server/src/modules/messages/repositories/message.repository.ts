import { MessageModel } from "../models/message.model";
import type {
  IMessage,
  CreateMessageInput,
} from "../types/message.types";

export const createMessage = async (
  input: CreateMessageInput
): Promise<IMessage> => {
  const message = await MessageModel.create(input);

  return message.toObject();
};

export const findRoomMessages = async (
  roomId: string,
  limit = 50
): Promise<IMessage[]> => {
  return MessageModel.find({
    roomId,
    type: "room",
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .lean()
    .exec();
};

export const findConversationMessages = async (
  conversationId: string,
  limit = 50
): Promise<IMessage[]> => {
  return MessageModel.find({
    conversationId,
    type: "dm",
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .lean()
    .exec();
};