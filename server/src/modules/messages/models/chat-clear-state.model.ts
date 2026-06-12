import { Schema, model, models } from "mongoose";

export interface IChatClearState {
  userId: Schema.Types.ObjectId;
  context: "room" | "dm";
  contextId: Schema.Types.ObjectId;
  clearedAt: Date;
}

const chatClearStateSchema = new Schema<IChatClearState>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    context: {
      type: String,
      enum: ["room", "dm"],
      required: true,
      index: true,
    },
    contextId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    clearedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick lookup: one clear state per user per context
chatClearStateSchema.index({ userId: 1, context: 1, contextId: 1 }, { unique: true });

export const ChatClearStateModel =
  models.ChatClearState || model<IChatClearState>("ChatClearState", chatClearStateSchema);
