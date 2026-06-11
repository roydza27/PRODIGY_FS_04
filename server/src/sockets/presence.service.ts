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
    if (!userId) return false;
    
    const uid = String(userId);
    let sockets = this.onlineUsers.get(uid);
    const isNew = !sockets || sockets.size === 0;

    if (!sockets) {
      sockets = new Set<string>();
      this.onlineUsers.set(uid, sockets);
    }

    sockets.add(socketId);
    
    logger.info(`[Presence] User ${uid} added socket ${socketId}. Total sockets: ${sockets.size}`);
    
    return isNew;
  }

  /**
   * Removes a socket connection for a user
   * @returns true if the user is now offline
   */
  remove(userId: string, socketId: string): boolean {
    if (!userId) return false;

    const uid = String(userId);
    const sockets = this.onlineUsers.get(uid);
    
    if (sockets) {
      sockets.delete(socketId);
      logger.info(`[Presence] User ${uid} removed socket ${socketId}. Sockets left: ${sockets.size}`);
      
      if (sockets.size === 0) {
        this.onlineUsers.delete(uid);
        return true;
      }
    } else {
      logger.warn(`[Presence] Attempted to remove socket ${socketId} for user ${uid}, but user not found in Map.`);
    }
    
    return false;
  }

  /**
   * Checks if a user is online
   */
  isOnline(userId: string): boolean {
    if (!userId) return false;
    const uid = String(userId);
    const sockets = this.onlineUsers.get(uid);
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
