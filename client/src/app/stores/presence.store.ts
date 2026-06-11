import { create } from "zustand";

type PresenceStore = {
  /**
   * Set of online user IDs
   */
  onlineUsers: Set<string>;

  /**
   * Map of userId -> ISO string of last seen timestamp
   */
  lastSeen: Record<string, string>;
  
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
  setUserOffline: (userId: string, lastSeenAt?: string) => void;

  /**
   * Clear all presence data
   */
  clearPresence: () => void;

  /**
   * Map of conversationId -> Set of userIds who are typing
   */
  typingUsers: Record<string, Set<string>>;

  /**
   * Mark a user as typing in a conversation
   */
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
};

export const usePresenceStore = create<PresenceStore>((set) => ({
  onlineUsers: new Set<string>(),
  lastSeen: {},
  typingUsers: {},

  setOnlineUsers: (userIds) => {
    set({ onlineUsers: new Set(userIds) });
  },

  setUserOnline: (userId) => {
    set((state) => {
      // If user becomes online, remove their last seen entry as they are now active
      const newLastSeen = { ...state.lastSeen };
      delete newLastSeen[userId];

      if (state.onlineUsers.has(userId)) {
        return { lastSeen: newLastSeen };
      }

      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.add(userId);
      return { onlineUsers: newOnlineUsers, lastSeen: newLastSeen };
    });
  },

  setUserOffline: (userId, lastSeenAt) => {
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.delete(userId);

      const newLastSeen = { ...state.lastSeen };
      if (lastSeenAt) {
        newLastSeen[userId] = lastSeenAt;
      }

      return { onlineUsers: newOnlineUsers, lastSeen: newLastSeen };
    });
  },

  clearPresence: () => {
    set({ onlineUsers: new Set(), lastSeen: {}, typingUsers: {} });
  },

  setTyping: (conversationId, userId, isTyping) => {
    set((state) => {
      const newTypingUsers = { ...state.typingUsers };
      const currentSet = new Set(newTypingUsers[conversationId] || []);
      
      if (isTyping) {
        currentSet.add(userId);
      } else {
        currentSet.delete(userId);
      }
      
      if (currentSet.size === 0) {
        delete newTypingUsers[conversationId];
      } else {
        newTypingUsers[conversationId] = currentSet;
      }
      
      return { typingUsers: newTypingUsers };
    });
  },
}));
