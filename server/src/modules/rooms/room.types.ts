import { Document, Types } from "mongoose";

export interface IRoom extends Document {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  name: string;
  description: string;
  type: "text" | "voice";
  isPrivate: boolean;
  isDefault: boolean;
  createdBy: Types.ObjectId;
  status: "active" | "archived";
  lastMessageAt?: Date;
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  type?: "text" | "voice";
  isPrivate?: boolean;
}
