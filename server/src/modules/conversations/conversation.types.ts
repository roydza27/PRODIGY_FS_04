import { Document, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationInput {
  workspaceId: string;
  participantId: string; // The person the current user is starting a DM with
}
