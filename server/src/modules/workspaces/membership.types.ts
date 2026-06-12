import type { HydratedDocument, Types } from "mongoose";

export interface IMembership {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: "owner" | "admin" | "member";
  status: "invited" | "active" | "removed" | "blocked";
  invitedBy?: Types.ObjectId | null;
  invitedAt?: Date | null;
  joinedAt?: Date | null;
  removedAt?: Date | null;
  nickname?: string;
  lastSeenAt?: Date | null;
  roomLastRead?: Record<string, Date>;
  mutedUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MembershipDocument = HydratedDocument<IMembership>;

export interface CreateMembershipInput {
  workspaceId: string;
  userId: string;
  role?: "owner" | "admin" | "member";
  status?: "invited" | "active";
  invitedBy?: string;
  nickname?: string;
}

export interface UpdateMembershipInput {
  role?: "owner" | "admin" | "member";
  status?: "invited" | "active" | "removed" | "blocked";
  nickname?: string;
}

export interface MembershipWithUserInfo extends IMembership {
  user?: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
    displayName: string;
  };
}
