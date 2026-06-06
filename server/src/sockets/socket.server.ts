import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { logger } from "../utils/logger";

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

    socket.join(`user:${userId}`);

    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerDMHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      logger.info(
        `[Socket] User disconnected: ${userId} (${reason})`
      );
    });
  });

  return io;
};