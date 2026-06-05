import { Types } from "mongoose";

export type MessageType = "room" | "dm";

export interface IMessage {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: MessageType;
  roomId?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  text: string;
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
}