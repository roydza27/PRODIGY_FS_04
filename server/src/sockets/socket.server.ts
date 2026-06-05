import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { registerRoomHandlers } from "./handlers/room.handler";
import { registerMessageHandlers } from "./handlers/message.handler";
import { registerDMHandlers } from "./handlers/dm.handler";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  // Middleware for authentication
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token as string, env.jwtSecret) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      logger.error("Socket Auth Error:", err);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.data.userId}`);

    // Register handlers
    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerDMHandlers(io, socket);

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
};
