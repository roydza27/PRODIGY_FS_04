import { create } from "zustand";

type PresenceStore = {
  /**
   * Set of online user IDs
   */
  onlineUsers: Set<string>;
  
  /**
   * Initialize online users
   */
  setOnlineUsers: (userIds: string[]) => void;
  
  /**
   * Mark a user as online
   */
  setUserOnline: (userId: string) => void;
  
  /**
   * Mark a user as offline
   */
  setUserOffline: (userId: string) => void;
  
  /**
   * Check if a user is online
   */
  isOnline: (userId: string) => boolean;
};

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  onlineUsers: new Set<string>(),

  setOnlineUsers: (userIds) => {
    set({ onlineUsers: new Set(userIds) });
  },

  setUserOnline: (userId) => {
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.add(userId);
      return { onlineUsers: newOnlineUsers };
    });
  },

  setUserOffline: (userId) => {
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.delete(userId);
      return { onlineUsers: newOnlineUsers };
    });
  },

  isOnline: (userId) => {
    return get().onlineUsers.has(userId);
  },
}));
