import * as roomRepository from "../../rooms/room.repository";
import * as messageRepository from "../repositories/message.repository";
import * as conversationRepository from "../../conversations/conversation.repository";
import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";
import { ChatClearStateModel } from "../models/chat-clear-state.model";
import { MembershipModel } from "../../workspaces/membership.model";
import { RoomModel } from "../../rooms/room.model";
import type { CreateMessageInput } from "../types/message.types";
import { socketService } from "../../../services/socket.service";
import { presenceService } from "../../../sockets/presence.service";

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
    .populate({
      path: "replyTo",
      populate: { path: "senderId", select: "name" },
    })
    .lean()
    .exec();

  // Broadcast via socket globally so sidebars and notifications work
  if (populatedMessage) {
    const io = socketService.getIO();

    if (input.type === "room") {
      // Broadcast to both the specific room and the entire workspace
      io.to(`room:${input.roomId}`).to(`workspace:${input.workspaceId}`).emit("message:new", populatedMessage);
    } else if (input.type === "dm" && input.conversationId) {
      // Find participants and broadcast directly to their user rooms
      const conversation = await conversationRepository.findConversationById(input.conversationId);
      if (conversation && conversation.participants) {
        let isDeliveredToAny = false;

        conversation.participants.forEach((participant: any) => {
          const participantId = typeof participant === "object" ? participant._id : participant;
          const participantIdStr = participantId.toString();
          
          socketService.emitToRoom(`user:${participantIdStr}`, "message:new", populatedMessage);

          // Proactive delivery check
          if (participantIdStr !== input.senderId.toString() && presenceService.isOnline(participantIdStr)) {
            isDeliveredToAny = true;
          }
        });

        // If at least one recipient is online, mark as delivered
        if (isDeliveredToAny) {
          await updateMessageStatus(message._id.toString(), "delivered");
          populatedMessage.status = "delivered" as any;
          
          // Notify sender about delivery
          socketService.emitToRoom(`user:${input.senderId}`, "message:status", {
            messageId: message._id,
            conversationId: input.conversationId,
            status: "delivered"
          });
        }
      }
    }
  }

  return populatedMessage;
};

export const getRoomHistory = async (
  roomId: string,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw "Invalid room id";
  }

  const room = await roomRepository.findRoomById(roomId);

  if (!room) {
    throw "Room not found";
  }

  return messageRepository.findRoomMessages(roomId, userId);
};

export const getConversationHistory = async (
  conversationId: string,
  userId: string
) => {
  return messageRepository.findConversationMessages(
    conversationId,
    userId
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
      const io = socketService.getIO();
      io.to(`room:${updatedMessage.roomId}`).to(`workspace:${updatedMessage.workspaceId}`).emit("message:updated", updatedMessage);
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

  const deletedMessage = await messageRepository.deleteMessage(messageId, userId);

  if (deletedMessage) {
    if (deletedMessage.type === "room") {
      const io = socketService.getIO();
      io.to(`room:${deletedMessage.roomId}`).to(`workspace:${deletedMessage.workspaceId}`).emit("message:updated", deletedMessage);
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

export const addReaction = async (
  messageId: string,
  userId: string,
  emoji: string
) => {
  const updatedMessage = await messageRepository.addReaction(messageId, userId, emoji);
  
  if (updatedMessage) {
    broadcastMessageUpdate(updatedMessage);
  }

  return updatedMessage;
};

export const removeReaction = async (
  messageId: string,
  userId: string,
  emoji: string
) => {
  const updatedMessage = await messageRepository.removeReaction(messageId, userId, emoji);
  
  if (updatedMessage) {
    broadcastMessageUpdate(updatedMessage);
  }

  return updatedMessage;
};

export const getSharedFiles = async (
  context: "room" | "dm",
  contextId: string,
  userId: string
) => {
  return messageRepository.findSharedFiles(context, contextId, userId);
};

const broadcastMessageUpdate = async (updatedMessage: any) => {
  if (updatedMessage.type === "room") {
    const io = socketService.getIO();
    io.to(`room:${updatedMessage.roomId}`).to(`workspace:${updatedMessage.workspaceId}`).emit("message:updated", updatedMessage);
  } else if (updatedMessage.type === "dm" && updatedMessage.conversationId) {
    const conversation = await conversationRepository.findConversationById(updatedMessage.conversationId.toString());
    if (conversation && conversation.participants) {
      conversation.participants.forEach((participant: any) => {
        const participantId = typeof participant === "object" ? participant._id : participant;
        socketService.emitToRoom(`user:${participantId}`, "message:updated", updatedMessage);
      });
    }
  }
};

export const clearChat = async (
  context: "room" | "dm",
  contextId: string,
  userId: string
) => {
  if (context === "room") {
    const room = await RoomModel.findById(contextId);
    if (!room) throw "Room not found";

    const membership = await MembershipModel.findOne({ userId, workspaceId: room.workspaceId });
    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      throw "Unauthorized: Only owners or admins can clear chat";
    }
  }

  await ChatClearStateModel.findOneAndUpdate(
    { userId, context, contextId },
    { clearedAt: new Date() },
    { upsert: true }
  );

  socketService.emitToRoom(
    `user:${userId}`,
    "chat:cleared",
    {
      context,
      contextId,
    }
  );
};