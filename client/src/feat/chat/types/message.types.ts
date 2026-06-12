export const MessageStatus = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  SEEN: "seen",
} as const;

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

export type MessageContentType = "TEXT" | "FILE" | "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "LINK" | "SYSTEM";

export interface IAttachment {
  id?: string;
  type: MessageContentType;
  url: string;
  filename: string;
  filesize: number;
  mimeType: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface IReaction {
  emoji: string;
  users: {
    _id: string;
    name: string;
  }[];
}

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
  messageType?: MessageContentType;
  text?: string;
  status: MessageStatus;
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  attachments?: IAttachment[];
  reactions?: IReaction[];
  replyTo?: Message;

  createdAt: string;
  updatedAt: string;
}

export type MessagesResponse = Message[];
