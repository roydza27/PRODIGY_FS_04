import { Types } from "mongoose";

export type MessageType = "room" | "dm";

export const MessageStatus = {
  SENT: "sent",
  DELIVERED: "delivered",
  SEEN: "seen",
} as const;

export type MessageStatus = typeof MessageStatus[keyof typeof MessageStatus];

export interface IMessage {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: MessageType;
  roomId?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  text: string;
  status: MessageStatus;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageInput {
  workspaceId: string;
  senderId: string;
  type: MessageType;
  roomId?: string;
  conversationId?: string;
  text: string;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>;
}