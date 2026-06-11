import { Schema, model, models } from "mongoose";
import type { IMessage } from "../types/message.types";

const messageSchema = new Schema<IMessage>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["room", "dm"],
      required: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },

    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({
  roomId: 1,
  createdAt: -1,
});

messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

export const MessageModel =
  models.Message || model<IMessage>("Message", messageSchema);