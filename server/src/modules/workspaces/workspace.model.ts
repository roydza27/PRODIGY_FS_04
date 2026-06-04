import { Schema, model, models } from "mongoose";
import type { IWorkspace } from "./workspace.types";

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    iconUrl: {
      type: String,
      default: "",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ["invite-only", "public"],
      default: "invite-only",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },
    memberCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    roomCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for querying user's workspaces
workspaceSchema.index({ ownerId: 1, status: 1 });

export const WorkspaceModel = models.Workspace || model<IWorkspace>("Workspace", workspaceSchema);
