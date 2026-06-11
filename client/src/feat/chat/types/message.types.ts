export const MessageStatus = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  SEEN: "seen",
} as const;

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

export interface Message {
  _id: string;

  workspaceId: string;
  roomId?: string;
  conversationId?: string;

  senderId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };

  type: "room" | "dm";
  text: string;
  status: MessageStatus;

  createdAt: string;
  updatedAt: string;
}

export type MessagesResponse = Message[];
