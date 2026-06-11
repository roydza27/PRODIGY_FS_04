export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  ownerId: string;
  visibility: "invite-only" | "public";
  status: "active" | "archived";
  memberCount: number;
  roomCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  displayName?: string;
  lastSeenAt?: string;
}

export interface Membership {
  _id: string;
  workspaceId: string;
  userId: string | WorkspaceUser;
  role: "owner" | "admin" | "member";
  status: "invited" | "active" | "removed" | "blocked";
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember extends Membership {
  user?: WorkspaceUser;
}

export interface WorkspaceInvite {
  _id: string;
  workspaceId: Workspace;
  userId: string | WorkspaceUser;
  invitedBy: WorkspaceUser;
  role: "admin" | "member";
  status: "invited";
  invitedAt: string;
}

export type CreateWorkspacePayload = {
  name: string;
  description?: string;
  iconUrl?: string;
  visibility?: "invite-only" | "public";
};

export type UpdateWorkspacePayload = {
  name?: string;
  description?: string;
  iconUrl?: string;
};

export type InviteMemberPayload = {
  email?: string;
  userId?: string;
  role?: "admin" | "member";
};

export type UpdateMemberRolePayload = {
  role: "owner" | "admin" | "member";
};
