import type { Response } from "express";
import * as workspaceService from "./workspace.service";
import * as validation from "./workspace.validation";
import type { AuthRequest } from "../../types/express";

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = validation.validateCreateWorkspace(req.body);
    const workspace = await workspaceService.createWorkspace(userId, payload);

    return res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces
 * Get all workspaces for current user
 */
export const getWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const workspaces = await workspaceService.getWorkspacesByUser(userId);

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces/:workspaceId
 * Get workspace details
 */
export const getWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is member
    const isMember = await workspaceService.isUserMember(workspaceId, userId);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    const workspace = await workspaceService.getWorkspace(workspaceId);

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * PATCH /api/workspaces/:workspaceId
 * Update workspace (owner only)
 */
export const updateWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is owner
    const role = await workspaceService.getUserRole(workspaceId, userId);
    if (role !== "owner") {
      return res.status(403).json({ error: "Only owner can update workspace" });
    }

    const payload = validation.validateUpdateWorkspace(req.body);
    const updated = await workspaceService.updateWorkspace(workspaceId, payload);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces/:workspaceId/members
 * Get workspace members
 */
export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is member
    const isMember = await workspaceService.isUserMember(workspaceId, userId);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    const members = await workspaceService.getWorkspaceMembers(workspaceId);

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * POST /api/workspaces/:workspaceId/invite
 * Invite a user to workspace (admin+ only)
 */
export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has permission to invite (owner or admin)
    const role = await workspaceService.getUserRole(workspaceId, userId);

    if (!role || !["owner", "admin"].includes(role)) {
      return res.status(403).json({ error: "Only owner or admin can invite members" });
    }

    const payload = validation.validateInviteMember(req.body);


    const membership = await workspaceService.inviteMember(
      workspaceId,
      payload.userId,
      userId,
      payload.role
    );

    return res.status(201).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * POST /api/workspaces/:workspaceId/accept-invite
 * Accept workspace invite
 */
export const acceptInvite = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const membership = await workspaceService.acceptInvite(workspaceId, userId);

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * POST /api/workspaces/:workspaceId/remove-member
 * Remove member from workspace (owner/admin only)
 */
export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { memberId } = validation.validateRemoveMember(req.body);

    // Check permission
    const role = await workspaceService.getUserRole(workspaceId, userId);
    if (!role || !["owner", "admin"].includes(role)) {
      return res.status(403).json({ error: "Only owner or admin can remove members" });
    }

    // Cannot remove owner
    const memberRole = await workspaceService.getUserRole(workspaceId, memberId);
    if (memberRole === "owner") {
      return res.status(403).json({ error: "Cannot remove workspace owner" });
    }

    await workspaceService.removeMember(workspaceId, memberId);

    return res.status(200).json({
      success: true,
      data: { message: "Member removed successfully" },
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};


/**
 * PATCH /api/workspaces/:workspaceId/members/role
 * Update member role (owner only)
 */
export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Expect memberId AND role in body
    const { memberId, role: newRole } = req.body;
    if (!memberId || !newRole || !["owner", "admin", "member"].includes(newRole)) {
      return res.status(400).json({ error: "Member ID and valid role required" });
    }

    // Only owner can change roles
    const userRole = await workspaceService.getUserRole(workspaceId, userId);
    if (userRole !== "owner") {
      return res.status(403).json({ error: "Only owner can change member roles" });
    }

    const membership = await workspaceService.updateMemberRole(
      workspaceId,
      memberId,
      newRole
    );

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};
