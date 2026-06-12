import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { logger } from "../utils/logger";
import { presenceService } from "./presence.service";
import { updateLastSeen } from "../modules/users/user.service";

import { registerRoomHandlers } from "./handlers/room.handler";
import { registerMessageHandlers } from "./handlers/message.handler";
import { registerDMHandlers } from "./handlers/dm.handler";
import { socketService } from "../services/socket.service";
import * as membershipRepository from "../modules/workspaces/membership.repository";

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

  // Store IO instance for global use
  socketService.setIO(io);

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
        logger.error("[Socket] Invalid JWT payload: userId missing");

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

  io.on("connection", async (socket: Socket) => {
    const userId = String(socket.data.userId);

    // Register presence
    const isFirstConnection = presenceService.add(userId, socket.id);
    
    socket.join(`user:${userId}`);

    // Automatically join all active workspace rooms to receive global notifications
    try {
      const memberships = await membershipRepository.findUserWorkspaces(userId, "active");
      memberships.forEach(m => {
        const workspaceId = typeof m.workspaceId === "object" ? (m.workspaceId as any)._id : m.workspaceId;
        if (workspaceId) {
          socket.join(`workspace:${workspaceId}`);
        }
      });
    } catch (err) {
      logger.error("[Socket] Failed to join workspace rooms on connect", err);
    }

    // Send initial presence sync
    socket.emit("presence:sync", {
      userIds: presenceService.getOnlineUserIds(),
    });

    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerDMHandlers(io, socket);

    // If it's the first connection for this user across all tabs, broadcast online status
    if (isFirstConnection) {
      io.emit("presence:online", { userId });
    }

    socket.on("disconnect", (reason) => {
      // Remove presence
      const isLastConnection = presenceService.remove(userId, socket.id);

      // If it was the last active connection for this user, broadcast offline status after a grace period
      if (isLastConnection) {
        const GRACE_PERIOD = 3000; // 3 seconds
        
        setTimeout(async () => {
          // Re-check if the user is still offline (didn't reconnect in another tab/refresh)
          if (!presenceService.isOnline(userId)) {
            const lastSeenAt = await updateLastSeen(userId);
            
            // TODO: Optimize presence broadcasts to be workspace-scoped instead of global
            io.emit("presence:offline", { 
              userId, 
              lastSeenAt: lastSeenAt.toISOString() 
            });
          }
        }, GRACE_PERIOD);
      }
    });
  });

  return io;
};
