import { api } from "@/services/api";
import type {
  Workspace,
  WorkspaceMember,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  InviteMemberPayload,
  
} from "../types/workspace.types";
import type {
  CreateWorkspaceResponse,
  GetWorkspacesResponse,
  GetWorkspaceResponse,
  UpdateWorkspaceResponse,
  GetMembersResponse,
  InviteMemberResponse,
  AcceptInviteResponse,
  RemoveMemberResponse,
  UpdateMemberRoleResponse,
} from "../types/workspace.api-types";

/**
 * Create a new workspace
 */
export const createWorkspaceApi = async (
  payload: CreateWorkspacePayload
): Promise<Workspace> => {
  const response = await api.post<CreateWorkspaceResponse>("/workspaces", payload);
  return response.data.data;
};

/**
 * Get all workspaces for current user
 */
export const getWorkspacesApi = async (): Promise<Workspace[]> => {
  const response = await api.get<GetWorkspacesResponse>("/workspaces");
  return response.data.data;
};

/**
 * Get a single workspace
 */
export const getWorkspaceApi = async (workspaceId: string): Promise<Workspace> => {
  const response = await api.get<GetWorkspaceResponse>(`/workspaces/${workspaceId}`);
  return response.data.data;
};

/**
 * Update workspace details
 */
export const updateWorkspaceApi = async (
  workspaceId: string,
  payload: UpdateWorkspacePayload
): Promise<Workspace> => {
  const response = await api.patch<UpdateWorkspaceResponse>(
    `/workspaces/${workspaceId}`,
    payload
  );
  return response.data.data;
};

/**
 * Get workspace members
 */
export const getWorkspaceMembersApi = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
  const response = await api.get<GetMembersResponse>(`/workspaces/${workspaceId}/members`);
  return response.data.data;
};

/**
 * Invite a user to workspace
 */
export const inviteMemberApi = async (
  workspaceId: string,
  payload: InviteMemberPayload
): Promise<void> => {
  await api.post<InviteMemberResponse>(`/workspaces/${workspaceId}/invite`, payload);
};

/**
 * Accept workspace invite
 */
export const acceptInviteApi = async (workspaceId: string): Promise<void> => {
  await api.post<AcceptInviteResponse>(`/workspaces/${workspaceId}/accept-invite`);
};

/**
 * Remove member from workspace
 */
export const removeMemberApi = async (
  workspaceId: string,
  memberId: string
): Promise<void> => {
  await api.post<RemoveMemberResponse>(`/workspaces/${workspaceId}/remove-member`, { memberId });
};

/**
 * Update member role
 */
export const updateMemberRoleApi = async (
  workspaceId: string,
  memberId: string,
  role: "owner" | "admin" | "member"
): Promise<void> => {
  await api.patch<UpdateMemberRoleResponse>(
    `/workspaces/${workspaceId}/members/role`,
    { memberId, role }
  );
};
