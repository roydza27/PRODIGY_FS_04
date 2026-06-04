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

export interface Membership {
  _id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  status: "invited" | "active" | "removed" | "blocked";
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember extends Membership {
  user?: {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
    displayName: string;
  };
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
  userId: string;
  role?: "admin" | "member";
};

export type UpdateMemberRolePayload = {
  role: "owner" | "admin" | "member";
};
