import { Server, Socket } from "socket.io";
import { logger } from "../../utils/logger";
import * as conversationService from "../../modules/conversations/conversation.service";

export const registerDMHandlers = (io: Server, socket: Socket) => {
  socket.on("dm:join", async ({ conversationId }) => {
    if (!conversationId) return;

    try {
      const userId = socket.data.userId;
      const conversation = await conversationService.getConversation(conversationId);

      // Check if user is a participant
      const isParticipant = conversation.participants.some(
        (p: any) => p._id.toString() === userId || p.toString() === userId
      );

      if (isParticipant) {
        const dmRoom = `dm:${conversationId}`;
        await socket.join(dmRoom);
        logger.info(`[Socket] User ${userId} joined DM room ${dmRoom}`);
      } else {
        logger.warn(`[Socket] User ${userId} attempted to join unauthorized DM ${conversationId}`);
      }
    } catch (error) {
      logger.error(`[Socket] Error joining DM room: ${error}`);
    }
  });

  socket.on("dm:leave", async ({ conversationId }) => {
    if (!conversationId) return;
    const dmRoom = `dm:${conversationId}`;
    await socket.leave(dmRoom);
    logger.info(`[Socket] User ${socket.data.userId} left DM room ${dmRoom}`);
  });
};
