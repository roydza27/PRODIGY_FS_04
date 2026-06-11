import { Server } from "socket.io";
import { logger } from "../utils/logger";

class SocketService {
  private io: Server | null = null;

  setIO(io: Server) {
    this.io = io;
    logger.info("[SocketService] IO instance set");
  }

  getIO(): Server {
    if (!this.io) {
      throw new Error("Socket.io not initialized");
    }
    return this.io;
  }

  /**
   * Broadcast an event to a specific room
   */
  emitToRoom(room: string, event: string, data: unknown) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }

  /**
   * Broadcast an event to all connected clients
   */
  emitGlobal(event: string, data: unknown) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
