import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { logger } from "../utils/logger";
import { presenceService } from "./presence.service";

import { registerRoomHandlers } from "./handlers/room.handler";
import { registerMessageHandlers } from "./handlers/message.handler";
import { registerDMHandlers } from "./handlers/dm.handler";

interface SocketJwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
  sub?: string;
}

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Authentication failed."));
    }

    try {
      const decoded = jwt.verify(
        token as string,
        env.jwtSecret
      ) as SocketJwtPayload;

      const userId =
        decoded.id ??
        decoded.userId ??
        decoded._id ??
        decoded.sub;

      if (!userId) {
        logger.error(
          "[Socket] Invalid JWT payload:",
          decoded
        );

        return next(
          new Error("Authentication failed.")
        );
      }

      socket.data.userId = userId;

      next();
    } catch (error) {
      logger.error(
        "Socket authentication failed",
        error
      );

      next(
        new Error("Authentication failed.")
      );
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    logger.info(
      `[Socket] User connected: ${userId}`
    );

    // Register presence
    const isFirstConnection = presenceService.add(userId, socket.id);
    
    socket.join(`user:${userId}`);

    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerDMHandlers(io, socket);

    // If it's the first connection for this user across all tabs, broadcast online status
    if (isFirstConnection) {
      io.emit("presence:online", { userId });
    }

    socket.on("disconnect", (reason) => {
      logger.info(
        `[Socket] User disconnected: ${userId} (${reason})`
      );

      // Remove presence
      const isLastConnection = presenceService.remove(userId, socket.id);

      // If it was the last active connection for this user, broadcast offline status
      if (isLastConnection) {
        io.emit("presence:offline", { userId });
      }
    });
  });

  return io;
};