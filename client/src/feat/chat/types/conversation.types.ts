export interface Conversation {
  _id: string;
  workspaceId: string;
  participants: {
    _id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  }[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationInput {
  participantId: string;
}
