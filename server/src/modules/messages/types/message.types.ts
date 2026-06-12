import { Types } from "mongoose";

export type MessageType = "room" | "dm";

export type MessageContentType = "TEXT" | "FILE" | "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "LINK" | "SYSTEM";

export const MessageStatus = {
  SENT: "sent",
  DELIVERED: "delivered",
  SEEN: "seen",
} as const;

export type MessageStatus = typeof MessageStatus[keyof typeof MessageStatus];

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
  users: Types.ObjectId[]; // Array of User IDs
}

export interface IMessage {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: MessageType;
  messageType?: MessageContentType;
  roomId?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  text?: string;
  status: MessageStatus;
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  attachments?: IAttachment[];
  reactions?: IReaction[];
  replyTo?: Types.ObjectId; // Reference to parent message
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageInput {
  workspaceId: string;
  senderId: string;
  type: MessageType;
  messageType?: MessageContentType;
  roomId?: string;
  conversationId?: string;
  text?: string;
  attachments?: IAttachment[];
  replyTo?: string; // ID of parent message
}