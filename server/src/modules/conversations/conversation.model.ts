import { Schema, model, models } from "mongoose";
import type { IConversation } from "./conversation.types";

const conversationSchema = new Schema<IConversation>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding DMs between specific users in a workspace
conversationSchema.index({ workspaceId: 1, participants: 1 });

export const ConversationModel =
  models.Conversation || model<IConversation>("Conversation", conversationSchema);
