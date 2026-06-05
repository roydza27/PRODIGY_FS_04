import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import * as messageService from "../modules/messages/services/message.service";
import * as messageRepository from "../modules/messages/repositories/message.repository";
import { logger } from "../utils/logger";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  // Middleware for authentication
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.data.userId}`);

    socket.on("room:join", ({ workspaceId, roomId }) => {
      const roomKey = `room:${roomId}`;
      socket.join(roomKey);
      logger.info(`User ${socket.data.userId} joined room ${roomId}`);
    });

    socket.on("room:leave", ({ workspaceId, roomId }) => {
      const roomKey = `room:${roomId}`;
      socket.leave(roomKey);
      logger.info(`User ${socket.data.userId} left room ${roomId}`);
    });

    socket.on("message:send", async (payload) => {
      const { workspaceId, roomId, text, type } = payload;
      const senderId = socket.data.userId;

      try {
        // Persist message
        const newMessage = await messageRepository.createMessage({
          workspaceId,
          roomId,
          senderId,
          text,
          type: type || "room",
        });

        // Broadcast to room (including sender if we want simple implementation, 
        // but client has optimistic update, so we can use broadcast.to if we want to exclude sender)
        // However, usually we emit to everyone and client handles deduplication
        
        // We need to populate the sender info before broadcasting
        // This is a bit simplified, in real app we'd fetch or use populated object
        const broadcastMessage = {
          ...newMessage,
          senderId: {
            _id: senderId,
            name: "You", // In real app, we'd fetch sender name
            avatarUrl: "", 
          }
        };

        io.to(`room:${roomId}`).emit("message:new", broadcastMessage);
      } catch (error) {
        logger.error("Error sending message via socket:", error);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
};
