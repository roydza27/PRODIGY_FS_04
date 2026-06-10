import { logger } from "../utils/logger";

class PresenceService {
  /**
   * Mapping of userId -> Set of socketIds
   */
  private onlineUsers = new Map<string, Set<string>>();

  /**
   * Adds a socket connection for a user
   * @returns true if the user was previously offline
   */
  add(userId: string, socketId: string): boolean {
    let sockets = this.onlineUsers.get(userId);
    const isNew = !sockets || sockets.size === 0;

    if (!sockets) {
      sockets = new Set<string>();
      this.onlineUsers.set(userId, sockets);
    }

    sockets.add(socketId);
    
    logger.info(`[Presence] User ${userId} added socket ${socketId}. Total sockets: ${sockets.size}`);
    
    return isNew;
  }

  /**
   * Removes a socket connection for a user
   * @returns true if the user is now offline
   */
  remove(userId: string, socketId: string): boolean {
    const sockets = this.onlineUsers.get(userId);
    
    if (sockets) {
      sockets.delete(socketId);
      logger.info(`[Presence] User ${userId} removed socket ${socketId}. Sockets left: ${sockets.size}`);
      
      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
        return true;
      }
    }
    
    return false;
  }

  /**
   * Checks if a user is online
   */
  isOnline(userId: string): boolean {
    const sockets = this.onlineUsers.get(userId);
    return !!sockets && sockets.size > 0;
  }

  /**
   * Gets all online user IDs
   */
  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }
}

export const presenceService = new PresenceService();
