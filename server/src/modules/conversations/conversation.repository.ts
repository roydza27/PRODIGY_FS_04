import mongoose from "mongoose";
import { ConversationModel } from "./conversation.model";
import { MessageModel } from "../messages/models/message.model";
import type { IConversation } from "./conversation.types";

export const findConversationById = async (id: string): Promise<IConversation | null> => {
  return ConversationModel.findById(id).populate("participants", "name avatarUrl username").lean();
};

export const findUserConversations = async (
  workspaceId: string,
  userId: string
): Promise<any[]> => {
  const conversations = await ConversationModel.find({
    workspaceId,
    participants: userId,
  })
    .populate("participants", "name avatarUrl username")
    .sort({ lastMessageAt: -1 })
    .lean();

  const userObjId = new mongoose.Types.ObjectId(userId);

  const enrichedConversations = await Promise.all(
    conversations.map(async (conv) => {
      const [lastMessage, unreadCount] = await Promise.all([
        MessageModel.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .populate("senderId", "name")
          .lean(),
        MessageModel.countDocuments({
          conversationId: conv._id,
          senderId: { $ne: userObjId },
          status: { $ne: "seen" },
        }),
      ]);

      return {
        ...conv,
        lastMessage,
        unreadCount,
      };
    })
  );

  return enrichedConversations;
};

export const findAllUserConversations = async (
  userId: string
): Promise<any[]> => {
  const conversations = await ConversationModel.find({
    participants: userId,
  })
    .populate("participants", "name avatarUrl username")
    .sort({ lastMessageAt: -1 })
    .lean();

  const userObjId = new mongoose.Types.ObjectId(userId);

  const enrichedConversations = await Promise.all(
    conversations.map(async (conv) => {
      const [lastMessage, unreadCount] = await Promise.all([
        MessageModel.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .populate("senderId", "name")
          .lean(),
        MessageModel.countDocuments({
          conversationId: conv._id,
          senderId: { $ne: userObjId },
          status: { $ne: "seen" },
        }),
      ]);

      return {
        ...conv,
        lastMessage,
        unreadCount,
      };
    })
  );

  return enrichedConversations;
};

export const findDM = async (
  workspaceId: string,
  participant1Id: string,
  participant2Id: string
): Promise<IConversation | null> => {
  return ConversationModel.findOne({
    workspaceId,
    participants: { $all: [participant1Id, participant2Id], $size: 2 },
  })
    .populate("participants", "name avatarUrl username")
    .lean();
};

export const createConversation = async (
  workspaceId: string,
  participants: string[]
): Promise<IConversation> => {
  const conversation = await ConversationModel.create({
    workspaceId,
    participants,
  });

  return conversation.toObject();
};

export const updateLastMessageAt = async (id: string): Promise<void> => {
  await ConversationModel.findByIdAndUpdate(id, {
    $set: { lastMessageAt: new Date() },
  });
};
