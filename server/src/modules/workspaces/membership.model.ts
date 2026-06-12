import { Schema, model, models } from "mongoose";
import type { IMembership } from "./membership.types";

const membershipSchema = new Schema<IMembership>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["invited", "active", "removed", "blocked"],
      default: "invited",
      index: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    invitedAt: {
      type: Date,
      default: null,
    },
    joinedAt: {
      type: Date,
      default: null,
    },
    removedAt: {
      type: Date,
      default: null,
    },
    nickname: {
      type: String,
      trim: true,
      default: "",
    },
    lastSeenAt: {
      type: Date,
      default: null,
    },
    roomLastRead: {
      type: Map,
      of: Date,
      default: {},
    },
    mutedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one membership per user per workspace
membershipSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

// Index for finding all members of a workspace
membershipSchema.index({ workspaceId: 1, status: 1 });

// Index for finding all workspaces a user belongs to
membershipSchema.index({ userId: 1, status: 1 });

export const MembershipModel =
  models.Membership || model<IMembership>("Membership", membershipSchema);
