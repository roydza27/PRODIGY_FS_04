export interface Conversation {
  _id: string;
  workspaceId: string;
  participants: {
    _id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    lastSeenAt?: string;
  }[];
  unreadCount?: number;
  lastMessage?: {
    _id: string;
    senderId: string | {
      _id: string;
      name: string;
      avatarUrl?: string;
    };
    text: string;
    createdAt: string;
  };
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationInput {
  participantId: string;
}
