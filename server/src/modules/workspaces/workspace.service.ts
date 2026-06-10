import * as workspaceRepository from "./workspace.repository";
import * as membershipRepository from "./membership.repository";
import { WorkspaceModel } from "./workspace.model";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.types";

/**
 * Generate a unique slug from workspace name
 */
const generateSlug = async (name: string): Promise<string> => {
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) slug = "workspace";

  let finalSlug = slug;
  let counter = 1;

  while (await workspaceRepository.findWorkspaceBySlug(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
};

/**
 * Create a new workspace and add owner as active member
 */
export const createWorkspace = async (
  userId: string,
  input: CreateWorkspaceInput
) => {
  const slug = await generateSlug(input.name);

  const workspace = await workspaceRepository.createWorkspace(userId, input, slug);

  await membershipRepository.createMembership({
    workspaceId: workspace._id.toString(),
    userId,
    role: "owner",
    status: "active",
    invitedBy: userId,
  });

  await workspaceRepository.recalculateMemberCount(workspace._id.toString());

  return workspace;
};

/**
 * Get all workspaces for a user
 */
export const getWorkspacesByUser = async (userId: string) => {
  return workspaceRepository.findWorkspacesByMemberUserId(userId, "active");
};

/**
 * Get all pending invites for a user
 */
export const getPendingInvites = async (userId: string) => {
  return membershipRepository.findUserWorkspaces(userId, "invited");
};

/**
 * Get workspace details
 */
export const getWorkspace = async (workspaceId: string) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);
  if (!workspace) {
    throw "Workspace not found";
  }
  return workspace;
};

/**
 * Get members of a workspace with user info
 */
export const getWorkspaceMembers = async (workspaceId: string) => {
  return membershipRepository.findWorkspaceMembers(workspaceId, "active");
};

/**
 * Invite a user to workspace
 */
export const inviteMember = async (
  workspaceId: string,
  userId: string,
  invitedByUserId: string,
  role: "admin" | "member" = "member"
) => {
  const existing = await membershipRepository.findMembership(workspaceId, userId);

  if (existing?.status === "active") {
    throw "User is already a member of this workspace";
  }

  if (existing?.status === "invited") {
    throw "User has already been invited";
  }

  if (existing) {
    const updated = await membershipRepository.updateMembershipByUserAndWorkspace(
      workspaceId,
      userId,
      {
        role,
        status: "invited",
        nickname: "",
      }
    );

    if (!updated) {
      throw "Failed to reinvite user";
    }

    return updated;
  }

  return membershipRepository.createMembership({
    workspaceId,
    userId,
    role,
    status: "invited",
    invitedBy: invitedByUserId,
  });
};
/**
 * User accepts workspace invite
 */
export const acceptInvite = async (workspaceId: string, userId: string) => {
  const membership = await membershipRepository.findMembership(workspaceId, userId);

  if (!membership) {
    throw "No invitation found for this workspace";
  }

  if (membership.status === "active") {
    throw "You are already a member of this workspace";
  }

  if (membership.status === "blocked") {
    throw "You are blocked from this workspace";
  }

  const updated = await membershipRepository.updateMembershipByUserAndWorkspace(
    workspaceId,
    userId,
    { status: "active" }
  );

  if (!updated) {
    throw "Failed to accept invitation";
  }

  await workspaceRepository.recalculateMemberCount(workspaceId);

  return updated;
};

/**
 * User declines workspace invite
 */
export const declineInvite = async (workspaceId: string, userId: string) => {
  const membership = await membershipRepository.findMembership(workspaceId, userId);

  if (!membership || membership.status !== "invited") {
    throw "No pending invitation found for this workspace";
  }

  return membershipRepository.removeMembership(workspaceId, userId);
};

/**
 * Remove member from workspace
 */
export const removeMember = async (workspaceId: string, userId: string) => {
  const existing = await membershipRepository.findMembership(workspaceId, userId);

  if (!existing) {
    throw "Member not found in workspace";
  }

  const wasActive = existing.status === "active";

  const membership = await membershipRepository.removeMembership(workspaceId, userId);

  if (!membership) {
    throw "Failed to remove member";
  }

  if (wasActive) {
    await workspaceRepository.recalculateMemberCount(workspaceId);
  }

  return membership;
};

/**
 * Update member's role in workspace
 */
export const updateMemberRole = async (
  workspaceId: string,
  userId: string,
  role: "owner" | "admin" | "member"
) => {
  const updated = await membershipRepository.updateMembershipByUserAndWorkspace(
    workspaceId,
    userId,
    { role }
  );

  if (!updated) {
    throw "Member not found";
  }

  return updated;
};

/**
 * Update workspace details (owner only)
 */
export const updateWorkspace = async (
  workspaceId: string,
  input: UpdateWorkspaceInput
) => {
  const updated = await workspaceRepository.updateWorkspace(workspaceId, input);

  if (!updated) {
    throw "Workspace not found";
  }

  return updated;
};

/**
 * Check if user is member of workspace
 */
export const isUserMember = async (workspaceId: string, userId: string): Promise<boolean> => {
  return membershipRepository.checkMembershipExists(workspaceId, userId);
};

/**
 * Get user's role in workspace
 */
export const getUserRole = async (
  workspaceId: string,
  userId: string
): Promise<"owner" | "admin" | "member" | null> => {
  return membershipRepository.getUserRoleInWorkspace(workspaceId, userId);
};

/**
 * Search workspaces by name
 */
export const searchWorkspaces = async (query: string) => {
  const searchRegex = new RegExp(query, "i");
  return WorkspaceModel.find({
    name: searchRegex,
    visibility: "public"
  })
  .limit(20)
  .lean();
};