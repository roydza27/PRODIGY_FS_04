import * as roomRepository from "../../rooms/room.repository";
import * as messageRepository from "../repositories/message.repository";
import * as conversationRepository from "../../conversations/conversation.repository";
import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";
import { MembershipModel } from "../../workspaces/membership.model";
import { RoomModel } from "../../rooms/room.model";
import type { CreateMessageInput } from "../types/message.types";
import { socketService } from "../../../services/socket.service";

export const sendMessage = async (input: CreateMessageInput) => {
  const message = await messageRepository.createMessage(input);

  // 1. If it's a DM, update the conversation's lastMessageAt
  if (input.type === "dm" && input.conversationId) {
    await conversationRepository.updateLastMessageAt(
      input.conversationId
    );
  }

  // 2. If it's a room message, update the room's lastMessageAt and lastMessage
  if (input.type === "room" && input.roomId) {
    await RoomModel.findByIdAndUpdate(input.roomId, {
      $set: { 
        lastMessageAt: new Date(),
        lastMessage: message._id
      }
    });
  }

  const populatedMessage = await MessageModel.findById(message._id)
    .populate("senderId", "name avatarUrl")
    .lean()
    .exec();

  // Broadcast via socket globally so sidebars and notifications work
  if (populatedMessage) {
    if (input.type === "room") {
      // Broadcast to entire workspace so sidebars update everywhere
      socketService.emitToRoom(`workspace:${input.workspaceId}`, "message:new", populatedMessage);
    } else if (input.type === "dm" && input.conversationId) {
      // Find participants and broadcast directly to their user rooms
      const conversation = await conversationRepository.findConversationById(input.conversationId);
      if (conversation && conversation.participants) {
        conversation.participants.forEach((participant: any) => {
          const participantId = typeof participant === "object" ? participant._id : participant;
          socketService.emitToRoom(`user:${participantId}`, "message:new", populatedMessage);
        });
      }
    }
  }

  return populatedMessage;
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

export const searchMessages = async (
  query: string,
  userId: string
) => {
  if (!query || query.length < 2) return [];

  // Get all workspaces user belongs to
  const memberships = await MembershipModel.find({ userId, status: "active" });
  const workspaceIds = memberships.map(m => m.workspaceId);

  return messageRepository.searchMessages(query, workspaceIds);
};

export const updateMessage = async (
  messageId: string,
  userId: string,
  text: string
) => {
  const message = await MessageModel.findById(messageId);
  if (!message) throw "Message not found";

  if (message.senderId.toString() !== userId) {
    throw "Unauthorized: You can only edit your own messages";
  }

  const updatedMessage = await messageRepository.updateMessage(messageId, text);
  
  if (updatedMessage) {
    if (updatedMessage.type === "room") {
      socketService.emitToRoom(`workspace:${updatedMessage.workspaceId}`, "message:updated", updatedMessage);
    } else if (updatedMessage.type === "dm" && updatedMessage.conversationId) {
      const conversation = await conversationRepository.findConversationById(updatedMessage.conversationId.toString());
      if (conversation && conversation.participants) {
        conversation.participants.forEach((participant: any) => {
          const participantId = typeof participant === "object" ? participant._id : participant;
          socketService.emitToRoom(`user:${participantId}`, "message:updated", updatedMessage);
        });
      }
    }
  }

  return updatedMessage;
};

export const deleteMessage = async (
  messageId: string,
  userId: string
) => {
  const message = await MessageModel.findById(messageId);
  if (!message) throw "Message not found";

  if (message.senderId.toString() !== userId) {
    throw "Unauthorized: You can only delete your own messages";
  }

  const deletedMessage = await messageRepository.deleteMessage(messageId);

  if (deletedMessage) {
    if (deletedMessage.type === "room") {
      socketService.emitToRoom(`workspace:${deletedMessage.workspaceId}`, "message:updated", deletedMessage);
    } else if (deletedMessage.type === "dm" && deletedMessage.conversationId) {
      const conversation = await conversationRepository.findConversationById(deletedMessage.conversationId.toString());
      if (conversation && conversation.participants) {
        conversation.participants.forEach((participant: any) => {
          const participantId = typeof participant === "object" ? participant._id : participant;
          socketService.emitToRoom(`user:${participantId}`, "message:updated", deletedMessage);
        });
      }
    }
  }

  return deletedMessage;
};

export const updateMessageStatus = async (
  messageId: string,
  status: string
) => {
  return messageRepository.updateMessageStatus(messageId, status);
};

export const markConversationAsSeen = async (
  conversationId: string,
  userId: string
) => {
  return messageRepository.markConversationAsSeen(conversationId, userId);
};