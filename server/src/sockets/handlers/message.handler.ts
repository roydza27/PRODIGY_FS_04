import { Server, Socket } from "socket.io";

import * as messageService from "../../modules/messages/services/message.service";
import * as membershipRepository from "../../modules/workspaces/membership.repository";
import * as roomRepository from "../../modules/rooms/room.repository";

import { logger } from "../../utils/logger";

const MAX_MESSAGE_LENGTH = 2000;

export const registerMessageHandlers = (
  io: Server,
  socket: Socket
) => {
  socket.on("message:send", async (payload = {}) => {
    try {
      const senderId = socket.data.userId;

      const {
        workspaceId,
        roomId,
        conversationId,
        text,
        messageType,
        attachments,
        replyTo,
      } = payload;

      /**
       * Basic validation
       */
      if (!workspaceId) {
        return;
      }

      const hasText = text && typeof text === "string" && text.trim().length > 0;
      const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

      if (!hasText && !hasAttachments) {
        return;
      }

      const trimmedText = text?.trim() || "";

      if (trimmedText.length > MAX_MESSAGE_LENGTH) {
        return;
      }

      /**
       * Validate workspace membership
       */
      const hasAccess =
        await membershipRepository.checkMembershipExists(
          workspaceId,
          senderId
        );

      if (!hasAccess) {
        logger.warn(
          `[Socket] Unauthorized message attempt by ${senderId}`
        );
        return;
      }

      /**
       * Determine message type on server
       */
      const type = conversationId ? "dm" : "room";

      /**
       * ROOM MESSAGE
       */
      if (type === "room") {
        if (!roomId) {
          return;
        }

        const room =
          await roomRepository.findRoomById(roomId);

        if (!room) {
          return;
        }

        if (
          room.workspaceId.toString() !== workspaceId
        ) {
          logger.warn(
            `[Socket] Room ${roomId} does not belong to workspace ${workspaceId}`
          );
          return;
        }
      }

      /**
       * Persist message (service handles broadcast)
       */
      await messageService.sendMessage({
        workspaceId,
        roomId,
        conversationId,
        senderId,
        text: trimmedText,
        type,
        messageType: messageType || "TEXT",
        attachments,
        replyTo,
      });

    } catch (error) {
      logger.error(
        "[Socket] message:send failed",
        error
      );
    }
  });

  socket.on("message:seen", async ({ messageId, conversationId }) => {
    try {
      const userId = socket.data.userId;

      if (messageId) {
        const updatedMessage = await messageService.updateMessageStatus(
          messageId,
          "seen"
        );
        
        if (updatedMessage) {
          const room = updatedMessage.type === "room" 
            ? `room:${updatedMessage.roomId}` 
            : `dm:${updatedMessage.conversationId}`;
          
          io.to(room).emit("message:updated", updatedMessage);
        }
      } else if (conversationId) {
        await messageService.markConversationAsSeen(conversationId, userId);
        // We might want to broadcast a "conversation:seen" event instead of updating every message
        io.to(`dm:${conversationId}`).emit("conversation:seen", { conversationId, userId });
      }
    } catch (error) {
      logger.error("[Socket] message:seen failed", error);
    }
  });
};