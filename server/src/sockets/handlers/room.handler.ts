import { Server, Socket } from "socket.io";
import { logger } from "../../utils/logger";
import * as membershipRepository from "../../modules/workspaces/membership.repository";
import * as roomRepository from "../../modules/rooms/room.repository";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on("auth:join", () => {
    const userRoom = `user:${socket.data.userId}`;
    socket.join(userRoom);
    logger.info(`User ${socket.data.userId} joined personal room`);
  });

  socket.on("workspace:join", async ({ workspaceId }) => {
    if (!workspaceId) return;

    try {
      const hasAccess = await membershipRepository.checkMembershipExists(
        workspaceId,
        socket.data.userId
      );

      if (hasAccess) {
        const workspaceRoom = `workspace:${workspaceId}`;
        await socket.join(workspaceRoom);
        logger.info(`User ${socket.data.userId} joined workspace ${workspaceId}`);
      } else {
        logger.warn(`User ${socket.data.userId} attempted to join unauthorized workspace ${workspaceId}`);
      }
    } catch (error) {
      logger.error(`Error joining workspace room: ${error}`);
    }
  });

  socket.on("room:join", async ({ workspaceId, roomId }) => {
    if (!roomId) return;

    try {
      // If workspaceId is provided, validate membership
      if (workspaceId) {
        const hasAccess = await membershipRepository.checkMembershipExists(
          workspaceId,
          socket.data.userId
        );

        if (!hasAccess) {
          logger.warn(`User ${socket.data.userId} attempted to join unauthorized room ${roomId} in workspace ${workspaceId}`);
          return;
        }
      }

      // Validate room exists in workspace
      const room = await roomRepository.findRoomById(roomId);
      if (!room) {
        logger.warn(`User ${socket.data.userId} attempted to join non-existent room ${roomId}`);
        return;
      }

      const roomKey = `room:${roomId}`;
      await socket.join(roomKey);
      logger.info(`[Socket] User ${socket.data.userId} joined room ${roomKey}. Current rooms: ${Array.from(socket.rooms).join(", ")}`);
    } catch (error) {
      logger.error(`Error joining room: ${error}`);
    }
  });

  socket.on("room:leave", async ({ roomId }) => {
    if (!roomId) return;
    const roomKey = `room:${roomId}`;
    await socket.leave(roomKey);
    logger.info(`User ${socket.data.userId} left room ${roomId}`);
  });
};
