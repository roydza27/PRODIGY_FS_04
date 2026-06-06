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
      } = payload;

      /**
       * Basic validation
       */
      if (!workspaceId) {
        return;
      }

      if (!text || typeof text !== "string") {
        return;
      }

      const trimmedText = text.trim();

      if (trimmedText.length === 0) {
        return;
      }

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
       * Persist message
       */
      const message =
        await messageService.sendMessage({
          workspaceId,
          roomId,
          conversationId,
          senderId,
          text: trimmedText,
          type,
        });

      if (!message) {
        return;
      }

      /**
       * Broadcast
       */
      if (type === "room") {
        io.to(`room:${roomId}`).emit(
          "message:new",
          message
        );

        logger.info(
          `[Socket] Room message broadcast -> room:${roomId}`
        );

        return;
      }

      io.to(`dm:${conversationId}`).emit(
        "message:new",
        message
      );

      logger.info(
        `[Socket] DM broadcast -> dm:${conversationId}`
      );
    } catch (error) {
      logger.error(
        "[Socket] message:send failed",
        error
      );
    }
  });
};