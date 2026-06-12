import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";
import { ChatClearStateModel } from "../models/chat-clear-state.model";
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
  userId: string,
  limit = 50
): Promise<IMessage[]> => {
  const clearState = await ChatClearStateModel.findOne({
    userId,
    context: "room",
    contextId: roomId,
  });

  const filter: any = {
    roomId,
    type: "room",
  };

  if (clearState) {
    filter.createdAt = { $gt: clearState.clearedAt };
  }

  return MessageModel.find(filter)
    .select("-__v")
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();
};

export const findConversationMessages = async (
  conversationId: string,
  userId: string,
  limit = 50
): Promise<IMessage[]> => {
  const clearState = await ChatClearStateModel.findOne({
    userId,
    context: "dm",
    contextId: conversationId,
  });

  const filter: any = {
    conversationId,
    type: "dm",
  };

  if (clearState) {
    filter.createdAt = { $gt: clearState.clearedAt };
  }

  const messages = await MessageModel.find(filter)
    .select("-__v")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();

  return messages.reverse();
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
      .populate({
        path: "replyTo",
        populate: { path: "senderId", select: "name" },
      })
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
      conversationId: new mongoose.Types.ObjectId(conversationId),
      senderId: { $ne: new mongoose.Types.ObjectId(userId) },
      status: { $ne: "seen" },
    },
    { $set: { status: "seen" } }
  ).exec();
};

export const updateMessage = async (
  messageId: string,
  text: string
): Promise<IMessage | null> => {
  return MessageModel.findByIdAndUpdate(
    messageId,
    { text, isEdited: true },
    { new: true }
  )
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();
};

export const deleteMessage = async (
  messageId: string,
  deletedBy?: string
): Promise<IMessage | null> => {
  return MessageModel.findByIdAndUpdate(
    messageId,
    { 
      text: "This message was deleted.", 
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy
    },
    { new: true }
  )
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();
};

export const searchMessages = async (
  query: string,
  workspaceIds: any[],
  limit = 20
): Promise<IMessage[]> => {
  return MessageModel.find({
    workspaceId: { $in: workspaceIds },
    $or: [
      { text: { $regex: query, $options: "i" } },
      { "attachments.filename": { $regex: query, $options: "i" } }
    ],
    isDeleted: { $ne: true },
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec() as Promise<IMessage[]>;
};

/**
 * Returns all messages that contain at least one attachment for a given
 * room or conversation. Used by the Shared Files panel.
 * Future media types (images, videos, audio) will appear here automatically
 * as they share the same attachments[] structure.
 */
export const findSharedFiles = async (
  context: "room" | "dm",
  contextId: string,
  userId: string,
  limit = 100
): Promise<IMessage[]> => {
  const clearState = await ChatClearStateModel.findOne({
    userId,
    context,
    contextId,
  });

  const filter: any =
    context === "room"
      ? { roomId: new mongoose.Types.ObjectId(contextId), type: "room" }
      : { conversationId: new mongoose.Types.ObjectId(contextId), type: "dm" };

  if (clearState) {
    filter.createdAt = { $gt: clearState.clearedAt };
  }

  return MessageModel.find({
    ...filter,
    attachments: { $exists: true, $not: { $size: 0 } },
    isDeleted: { $ne: true },
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec() as Promise<IMessage[]>;
};

export const addReaction = async (
  messageId: string,
  userId: string,
  emoji: string
): Promise<IMessage | null> => {
  // 1. Ensure reactions field exists by initializing it if missing
  await MessageModel.updateOne(
    { _id: messageId, reactions: { $exists: false } },
    { $set: { reactions: [] } }
  );

  // 2. Remove user from ANY existing reaction with this same emoji (to be safe)
  await MessageModel.findByIdAndUpdate(messageId, {
    $pull: { "reactions.$[].users": new mongoose.Types.ObjectId(userId) },
  });

  // 3. Add user to the specific emoji reaction
  const message = await MessageModel.findOne({ _id: messageId, "reactions.emoji": emoji });

  if (message) {
    // Emoji exists, push user to it
    await MessageModel.updateOne(
      { _id: messageId, "reactions.emoji": emoji },
      { $addToSet: { "reactions.$.users": new mongoose.Types.ObjectId(userId) } }
    );
  } else {
    // Emoji doesn't exist, push new reaction object
    await MessageModel.findByIdAndUpdate(messageId, {
      $push: { reactions: { emoji, users: [new mongoose.Types.ObjectId(userId)] } },
    });
  }

  return MessageModel.findById(messageId)
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();
};

export const removeReaction = async (
  messageId: string,
  userId: string,
  emoji: string
): Promise<IMessage | null> => {
  await MessageModel.updateOne(
    { _id: messageId, "reactions.emoji": emoji },
    { $pull: { "reactions.$.users": userId } }
  );

  // Optional: Clean up empty reactions
  await MessageModel.findByIdAndUpdate(messageId, {
    $pull: { reactions: { users: { $size: 0 } } },
  });

  return MessageModel.findById(messageId)
    .populate("senderId", "name avatarUrl")
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();
};