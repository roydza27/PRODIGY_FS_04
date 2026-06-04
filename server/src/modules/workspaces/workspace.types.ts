import type { HydratedDocument, Types } from "mongoose";

export interface IWorkspace {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  ownerId: Types.ObjectId;
  visibility: "invite-only" | "public";
  status: "active" | "archived";
  memberCount: number;
  roomCount: number;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceDocument = HydratedDocument<IWorkspace>;

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  iconUrl?: string;
  visibility?: "invite-only" | "public";
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  iconUrl?: string;
}
