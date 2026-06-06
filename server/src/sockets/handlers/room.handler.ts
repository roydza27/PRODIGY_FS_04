import { Server, Socket } from "socket.io";

import { logger } from "../../utils/logger";

import * as membershipRepository from "../../modules/workspaces/membership.repository";
import * as roomRepository from "../../modules/rooms/room.repository";

export const registerRoomHandlers = (
  io: Server,
  socket: Socket
) => {
  /**
   * Join Workspace
   */
  socket.on("workspace:join", async ({ workspaceId }) => {
    if (!workspaceId) return;

    try {
      const userId = socket.data.userId;

      const hasAccess =
        await membershipRepository.checkMembershipExists(
          workspaceId,
          userId
        );

      if (!hasAccess) {
        logger.warn(
          `[Socket] Unauthorized workspace join: ${userId} -> ${workspaceId}`
        );
        return;
      }

      const workspaceRoom = `workspace:${workspaceId}`;

      await socket.join(workspaceRoom);

      logger.info(
        `[Socket] ${userId} joined ${workspaceRoom}`
      );
    } catch (error) {
      logger.error(
        "[Socket] workspace:join failed",
        error
      );
    }
  });

  /**
   * Leave Workspace
   */
  socket.on("workspace:leave", async ({ workspaceId }) => {
    if (!workspaceId) return;

    try {
      const workspaceRoom = `workspace:${workspaceId}`;

      await socket.leave(workspaceRoom);

      logger.info(
        `[Socket] ${socket.data.userId} left ${workspaceRoom}`
      );
    } catch (error) {
      logger.error(
        "[Socket] workspace:leave failed",
        error
      );
    }
  });

  /**
   * Join Room
   */
  socket.on(
    "room:join",
    async ({ workspaceId, roomId }) => {
      if (!workspaceId || !roomId) return;

      try {
        const userId = socket.data.userId;

        const hasAccess =
          await membershipRepository.checkMembershipExists(
            workspaceId,
            userId
          );

        if (!hasAccess) {
          logger.warn(
            `[Socket] Unauthorized room join: ${userId}`
          );
          return;
        }

        const room =
          await roomRepository.findRoomById(roomId);

        if (!room) {
          logger.warn(
            `[Socket] Room not found: ${roomId}`
          );
          return;
        }

        /**
         * Ensure room belongs to workspace
         */
        if (
          room.workspaceId.toString() !== workspaceId
        ) {
          logger.warn(
            `[Socket] Room ${roomId} does not belong to workspace ${workspaceId}`
          );
          return;
        }

        /**
         * Leave previous active room
         */
        const previousRoom =
          socket.data.activeRoom;

        if (previousRoom) {
          await socket.leave(previousRoom);
        }

        const roomKey = `room:${roomId}`;

        await socket.join(roomKey);

        socket.data.activeRoom = roomKey;

        logger.info(
          `[Socket] ${userId} joined ${roomKey}`
        );
      } catch (error) {
        logger.error(
          "[Socket] room:join failed",
          error
        );
      }
    }
  );

  /**
   * Leave Room
   */
  socket.on("room:leave", async ({ roomId }) => {
    if (!roomId) return;

    try {
      const roomKey = `room:${roomId}`;

      await socket.leave(roomKey);

      if (
        socket.data.activeRoom === roomKey
      ) {
        socket.data.activeRoom = undefined;
      }

      logger.info(
        `[Socket] ${socket.data.userId} left ${roomKey}`
      );
    } catch (error) {
      logger.error(
        "[Socket] room:leave failed",
        error
      );
    }
  });
};