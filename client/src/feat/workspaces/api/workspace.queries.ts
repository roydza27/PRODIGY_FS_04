import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as workspaceApi from "./workspace.api";
import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  InviteMemberPayload,
} from "../types/workspace.types";

// Query keys
const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  list: (userId: string) => [...workspaceKeys.lists(), { userId }] as const,
  details: () => [...workspaceKeys.all, "detail"] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  members: () => [...workspaceKeys.all, "members"] as const,
  membersList: (workspaceId: string) => [...workspaceKeys.members(), workspaceId] as const,
};

/**
 * Query: Get all workspaces for current user
 */
export const useGetWorkspaces = (enabled = true) => {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: workspaceApi.getWorkspacesApi,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Query: Get single workspace
 */
export const useGetWorkspace = (workspaceId: string, enabled = true) => {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceApi.getWorkspaceApi(workspaceId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Query: Get workspace members
 */
export const useGetWorkspaceMembers = (workspaceId: string, enabled = true) => {
  return useQuery({
    queryKey: workspaceKeys.membersList(workspaceId),
    queryFn: () => workspaceApi.getWorkspaceMembersApi(workspaceId),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Mutation: Create workspace
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) => workspaceApi.createWorkspaceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
};

/**
 * Mutation: Update workspace
 */
export const useUpdateWorkspace = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkspacePayload) =>
      workspaceApi.updateWorkspaceApi(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
};

/**
 * Mutation: Invite member
 */
export const useInviteMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteMemberPayload) =>
      workspaceApi.inviteMemberApi(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.membersList(workspaceId) });
    },
  });
};

/**
 * Mutation: Accept workspace invite
 */
export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceApi.acceptInviteApi(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
};

/**
 * Mutation: Remove member
 */
export const useRemoveMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => workspaceApi.removeMemberApi(workspaceId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.membersList(workspaceId) });
    },
  });
};

/**
 * Mutation: Update member role
 */
export const useUpdateMemberRole = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: "owner" | "admin" | "member" }) =>
      workspaceApi.updateMemberRoleApi(workspaceId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.membersList(workspaceId) });
    },
  });
};