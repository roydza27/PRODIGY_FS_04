import { Schema, model, models } from "mongoose";
import type { IMessage } from "../types/message.types";
import { MessageStatus } from "../types/message.types";

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

    messageType: {
      type: String,
      enum: [
        "TEXT",
        "FILE",
        "DOCUMENT",
        "IMAGE",
        "VIDEO",
        "AUDIO",
        "LINK",
        "SYSTEM",
      ],
      default: "TEXT",
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
      trim: true,
      maxlength: 4000,
    },

    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.SENT,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    attachments: [
      {
        id: { type: String },
        type: { type: String, required: true },
        url: { type: String, required: true },
        filename: { type: String, required: true },
        filesize: { type: Number, required: true },
        mimeType: { type: String, required: true },
        thumbnail: { type: String },
        width: { type: Number },
        height: { type: Number },
        duration: { type: Number },
      },
    ],

    reactions: [
      {
        emoji: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      index: true,
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