import { Server, Socket } from "socket.io";

import { logger } from "../../utils/logger";

import * as conversationService from "../../modules/conversations/conversation.service";
import * as membershipRepository from "../../modules/workspaces/membership.repository";
import * as messageRepository from "../../modules/messages/repositories/message.repository";

export const registerDMHandlers = (
  io: Server,
  socket: Socket
) => {
  /**
   * Message Delivered
   */
  socket.on(
    "dm:delivered",
    async ({ messageId, conversationId }) => {
      if (!messageId || !conversationId) return;

      try {
        const message = await messageRepository.updateMessageStatus(
          messageId,
          "delivered"
        );

        if (message) {
          // Notify the sender
          io.to(`dm:${conversationId}`).emit("message:status", {
            messageId,
            conversationId,
            status: "delivered",
          });
        }
      } catch (error) {
        logger.error("[Socket] dm:delivered failed", error);
      }
    }
  );

  /**
   * Message Seen
   */
  socket.on(
    "dm:seen",
    async ({ conversationId }) => {
      if (!conversationId) return;

      try {
        const userId = socket.data.userId;

        await messageRepository.markConversationAsSeen(
          conversationId,
          userId
        );

        // Notify all participants in the DM room
        io.to(`dm:${conversationId}`).emit("message:seen:all", {
          conversationId,
          seenBy: userId,
        });
      } catch (error) {
        logger.error("[Socket] dm:seen failed", error);
      }
    }
  );

  /**
   * Join DM
   */
  socket.on(
    "dm:join",
    async ({ workspaceId, conversationId }) => {
      if (!conversationId) {
        return;
      }

      try {
        const userId = socket.data.userId;

        /**
         * Validate workspace membership if workspaceId is provided
         */
        if (workspaceId) {
          const hasAccess =
            await membershipRepository.checkMembershipExists(
              workspaceId,
              userId
            );

          if (!hasAccess) {
            logger.warn(
              `[Socket] Unauthorized DM join by ${userId} for workspace ${workspaceId}`
            );
            return;
          }
        }

        /**
         * Load conversation
         */
        const conversation =
          await conversationService.getConversation(
            conversationId
          );

        if (!conversation) {
          logger.warn(
            `[Socket] Conversation not found: ${conversationId}`
          );
          return;
        }

        /**
         * Verify user is a participant
         */
        const isParticipant = conversation.participants.some(
          (participant: unknown) => {
            const id =
              typeof participant === "string"
                ? participant
                : (participant as { _id?: { toString: () => string } })?._id?.toString();

            return id === userId;
          }
        );

        if (!isParticipant) {
          logger.warn(
            `[Socket] User ${userId} is not a participant of ${conversationId}`
          );
          return;
        }

        /**
         * Leave previous active DM
         */
        const previousDM =
          socket.data.activeDM;

        if (previousDM) {
          await socket.leave(previousDM);
        }

        const dmRoom = `dm:${conversationId}`;

        await socket.join(dmRoom);

        socket.data.activeDM = dmRoom;

        logger.info(
          `[Socket] ${userId} joined ${dmRoom}`
        );
      } catch (error) {
        logger.error(
          "[Socket] dm:join failed",
          error
        );
      }
    }
  );

  /**
   * Leave DM
   */
  socket.on(
    "dm:leave",
    async ({ conversationId }) => {
      if (!conversationId) {
        return;
      }

      try {
        const dmRoom = `dm:${conversationId}`;

        await socket.leave(dmRoom);

        if (socket.data.activeDM === dmRoom) {
          socket.data.activeDM = undefined;
        }

        logger.info(
          `[Socket] ${socket.data.userId} left ${dmRoom}`
        );
      } catch (error) {
        logger.error(
          "[Socket] dm:leave failed",
          error
        );
      }
    }
  );

  /**
   * Typing Start
   */
  socket.on(
    "dm:typing:start",
    ({ conversationId }) => {
      if (!conversationId) return;
      const dmRoom = `dm:${conversationId}`;
      socket.to(dmRoom).emit("dm:typing:start", {
        conversationId,
        userId: socket.data.userId,
      });
    }
  );

  /**
   * Typing Stop
   */
  socket.on(
    "dm:typing:stop",
    ({ conversationId }) => {
      if (!conversationId) return;
      const dmRoom = `dm:${conversationId}`;
      socket.to(dmRoom).emit("dm:typing:stop", {
        conversationId,
        userId: socket.data.userId,
      });
    }
  );
};