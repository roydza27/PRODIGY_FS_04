import { Server, Socket } from "socket.io";

import { logger } from "../../utils/logger";

import * as conversationService from "../../modules/conversations/conversation.service";
import * as membershipRepository from "../../modules/workspaces/membership.repository";

export const registerDMHandlers = (
  io: Server,
  socket: Socket
) => {
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
          (participant: any) => {
            const id =
              participant?._id?.toString?.() ??
              participant?.toString?.();

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
};