import { Server, Socket } from "socket.io";
import * as messageService from "../../modules/messages/services/message.service";
import { logger } from "../../utils/logger";
import * as membershipRepository from "../../modules/workspaces/membership.repository";

export const registerMessageHandlers = (io: Server, socket: Socket) => {
  socket.on("message:send", async (payload) => {
    const { workspaceId, roomId, text, type } = payload;
    const senderId = socket.data.userId;

    if (!workspaceId || !roomId || !text) {
      logger.error("Missing required fields for message:send");
      return;
    }

    try {
      // Validate membership before saving/broadcasting
      const hasAccess = await membershipRepository.checkMembershipExists(
        workspaceId,
        senderId
      );

      if (!hasAccess) {
        logger.warn(`User ${senderId} attempted to send message to unauthorized workspace ${workspaceId}`);
        return;
      }

      const newMessage = await messageService.sendMessage({
        workspaceId,
        roomId,
        conversationId: payload.conversationId,
        senderId,
        text,
        type: type || (payload.conversationId ? "dm" : "room"),
      });

      if (newMessage) {
        if (newMessage.type === "room") {
          const roomKey = `room:${roomId}`;
          io.to(roomKey).emit("message:new", newMessage);
          logger.info(`[Socket] Message from ${senderId} broadcast to ${roomKey}`);
        } else if (newMessage.type === "dm") {
          const dmKey = `dm:${newMessage.conversationId}`;
          io.to(dmKey).emit("message:new", newMessage);
          logger.info(`[Socket] DM from ${senderId} broadcast to ${dmKey}`);
        }
      }
    } catch (error) {
      logger.error("Error sending message via socket:", error);
    }
  });
};
