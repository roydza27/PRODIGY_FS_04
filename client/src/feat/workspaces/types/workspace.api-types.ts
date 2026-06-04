import type { Workspace, Membership, WorkspaceMember } from "./workspace.types";

export interface CreateWorkspaceResponse {
  success: boolean;
  data: Workspace;
}

export interface GetWorkspacesResponse {
  success: boolean;
  data: Workspace[];
}

export interface GetWorkspaceResponse {
  success: boolean;
  data: Workspace;
}

export interface UpdateWorkspaceResponse {
  success: boolean;
  data: Workspace;
}

export interface GetMembersResponse {
  success: boolean;
  data: WorkspaceMember[];
}

export interface InviteMemberResponse {
  success: boolean;
  data: Membership;
}

export interface AcceptInviteResponse {
  success: boolean;
  data: Membership;
}

export interface RemoveMemberResponse {
  success: boolean;
  data: Membership;
}

export interface UpdateMemberRoleResponse {
  success: boolean;
  data: Membership;
}
