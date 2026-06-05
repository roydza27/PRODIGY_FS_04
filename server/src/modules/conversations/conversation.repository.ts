import { ConversationModel } from "./conversation.model";
import type { IConversation } from "./conversation.types";

export const findConversationById = async (id: string): Promise<IConversation | null> => {
  return ConversationModel.findById(id).populate("participants", "name avatarUrl").lean();
};

export const findUserConversations = async (
  workspaceId: string,
  userId: string
): Promise<IConversation[]> => {
  return ConversationModel.find({
    workspaceId,
    participants: userId,
  })
    .populate("participants", "name avatarUrl")
    .sort({ lastMessageAt: -1 })
    .lean();
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
    .populate("participants", "name avatarUrl")
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
