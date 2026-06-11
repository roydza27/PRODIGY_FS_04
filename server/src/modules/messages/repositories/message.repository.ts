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
    .sort({ createdAt: 1 })
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
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .lean()
    .exec();
};

export const updateMessageStatus = async (
  messageId: string,
  status: string
): Promise<IMessage | null> => {
  // Define status priority
  const statusPriority: Record<string, number> = {
    sent: 1,
    delivered: 2,
    seen: 3,
  };

  const message = await MessageModel.findById(messageId);
  if (!message) return null;

  // Only update if the new status is more advanced
  if (statusPriority[status] > statusPriority[message.status]) {
    message.status = status;
    await message.save();
    
    return MessageModel.findById(messageId)
      .populate("senderId", "name avatarUrl")
      .lean()
      .exec();
  }

  return message.toObject();
};

export const markConversationAsSeen = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  await MessageModel.updateMany(
    {
      conversationId,
      senderId: { $ne: userId },
      status: { $ne: "seen" },
    },
    { status: "seen" }
  ).exec();
};